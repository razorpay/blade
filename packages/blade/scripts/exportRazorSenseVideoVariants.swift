import AVFoundation
import CoreMedia
import CryptoKit
import Foundation
import ImageIO
import UniformTypeIdentifiers

// This exporter intentionally accepts only the untrimmed 10-second Typing masters. The HEVC
// preset is excluded because preflight candidates changed color metadata and missed the SSIM gate.
private let typingStart = CMTime(value: 167, timescale: 25)
private let typingDuration = CMTime(value: 83, timescale: 25)
private let typingSourceEnd = CMTimeAdd(typingStart, typingDuration)

private struct Arguments {
  let assetsRoot: URL
  let outputDirectory: URL
  let frameDirectory: URL
}

private struct FrameCheckpoint {
  let name: String
  let sourceTime: CMTime

  var candidateTime: CMTime {
    CMTimeSubtract(sourceTime, typingStart)
  }
}

private struct VideoMetadata: Encodable {
  let codec: String
  let width: Int
  let height: Int
  let framesPerSecond: Double
  let frameCount: Int
  let encodedSampleCount: Int
  let durationSeconds: Double
  let bitrate: Int
  let colorPrimaries: String
  let transferFunction: String
  let yCbCrMatrix: String
  let formatDescriptionDigest: String
  let sampleDigest: String
}

private struct ExportReport: Encodable {
  let input: String
  let output: String
  let preset: String
  let start: String
  let duration: String
  let oldBytes: Int
  let newBytes: Int
  let savedBytes: Int
  let source: VideoMetadata
  let candidate: VideoMetadata
  let samplesMatch: Bool
  let metadataMatches: Bool
}

private enum ExportError: LocalizedError {
  case invalidArguments(String)
  case missingInput(String)
  case outputCollision(String)
  case unavailablePreset(String)
  case missingVideoTrack(String)
  case exportFailed(String)
  case metadataMismatch(String)
  case sampleMismatch(String)
  case frameCaptureFailed(String)
  case payloadIncrease(String)

  var errorDescription: String? {
    switch self {
    case .invalidArguments(let message),
      .missingInput(let message),
      .outputCollision(let message),
      .unavailablePreset(let message),
      .missingVideoTrack(let message),
      .exportFailed(let message),
      .metadataMismatch(let message),
      .sampleMismatch(let message),
      .frameCaptureFailed(let message),
      .payloadIncrease(let message):
      return message
    }
  }
}

private let checkpoints = [
  FrameCheckpoint(name: "first", sourceTime: CMTime(value: 167, timescale: 25)),
  FrameCheckpoint(name: "attack", sourceTime: CMTime(value: 180, timescale: 25)),
  FrameCheckpoint(name: "peak-grid", sourceTime: CMTime(value: 216, timescale: 25)),
  FrameCheckpoint(name: "hold", sourceTime: CMTime(value: 230, timescale: 25)),
  FrameCheckpoint(name: "last-visible", sourceTime: CMTime(value: 249, timescale: 25)),
]

private let typingFiles = [
  "razorsense-typing.mp4",
  "razorsense-typing-dark.mp4",
]

private func parseArguments(_ arguments: [String]) throws -> Arguments {
  var values: [String: String] = [:]
  var index = 0
  let supported = Set(["--assets-root", "--output-dir", "--write-frames"])

  while index < arguments.count {
    let option = arguments[index]
    guard supported.contains(option) else {
      throw ExportError.invalidArguments("Unknown argument: \(option)")
    }
    guard index + 1 < arguments.count else {
      throw ExportError.invalidArguments("Missing value for \(option)")
    }
    guard values[option] == nil else {
      throw ExportError.invalidArguments("Duplicate argument: \(option)")
    }
    values[option] = arguments[index + 1]
    index += 2
  }

  guard let assetsRoot = values["--assets-root"],
    let outputDirectory = values["--output-dir"],
    let frameDirectory = values["--write-frames"]
  else {
    throw ExportError.invalidArguments(
      "Usage: swift scripts/exportRazorSenseVideoVariants.swift --assets-root <path> --output-dir <path> --write-frames <path>",
    )
  }

  return Arguments(
    assetsRoot: URL(fileURLWithPath: assetsRoot).standardizedFileURL,
    outputDirectory: URL(fileURLWithPath: outputDirectory).standardizedFileURL,
    frameDirectory: URL(fileURLWithPath: frameDirectory).standardizedFileURL,
  )
}

private func fileSize(at url: URL) throws -> Int {
  let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
  return (attributes[.size] as? NSNumber)?.intValue ?? 0
}

private func fourCharacterCode(_ code: FourCharCode) -> String {
  let scalars = [24, 16, 8, 0].map { shift in
    UnicodeScalar((code >> FourCharCode(shift)) & 0xFF).map(Character.init) ?? "?"
  }
  return String(scalars)
}

private func extensionString(
  _ extensions: [String: Any],
  key: CFString,
) -> String {
  let value = extensions[key as String]
  if let value = value as? String { return value }
  if let value { return String(describing: value) }
  return "unspecified"
}

private func sha256(_ data: Data) -> String {
  SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
}

private func dataExtension(_ extensions: [String: Any], key: CFString) -> Data? {
  extensions[key as String] as? Data
}

private func sampleDescriptionAtoms(_ extensions: [String: Any]) -> [String: Any] {
  extensions[kCMFormatDescriptionExtension_SampleDescriptionExtensionAtoms as String]
    as? [String: Any] ?? [:]
}

private func codecString(formatDescription: CMFormatDescription, extensions: [String: Any])
  -> String
{
  let base = fourCharacterCode(CMFormatDescriptionGetMediaSubType(formatDescription))
  let atoms = sampleDescriptionAtoms(extensions)
  guard let configuration = atoms["avcC"] as? Data, configuration.count >= 4 else { return base }
  let profile = configuration[1]
  let compatibility = configuration[2]
  let level = configuration[3]
  return String(format: "%@.%02X%02X%02X", base, profile, compatibility, level)
}

private struct SampleStats {
  let encodedSampleCount: Int
  let digest: String
}

private struct DecodedFrameStats {
  let frameCount: Int
  let framesPerSecond: Double
}

private func encodedSampleStats(
  asset: AVAsset,
  track: AVAssetTrack,
  timeRange: CMTimeRange,
) throws -> SampleStats {
  let reader = try AVAssetReader(asset: asset)
  reader.timeRange = timeRange
  let output = AVAssetReaderTrackOutput(track: track, outputSettings: nil)
  output.alwaysCopiesSampleData = false
  guard reader.canAdd(output) else {
    throw ExportError.exportFailed(
      "Cannot read compressed samples from \(track.asset?.description ?? "asset")")
  }
  reader.add(output)
  guard reader.startReading() else {
    throw ExportError.exportFailed(
      reader.error?.localizedDescription ?? "Could not start sample reader")
  }

  var encodedSampleCount = 0
  var hasher = SHA256()
  while let sampleBuffer = output.copyNextSampleBuffer() {
    let sampleCount = CMSampleBufferGetNumSamples(sampleBuffer)
    encodedSampleCount += sampleCount
    guard let blockBuffer = CMSampleBufferGetDataBuffer(sampleBuffer) else { continue }
    let byteCount = CMBlockBufferGetDataLength(blockBuffer)
    var bytes = Data(count: byteCount)
    let result = bytes.withUnsafeMutableBytes { buffer in
      guard let baseAddress = buffer.baseAddress else {
        return kCMBlockBufferBadCustomBlockSourceErr
      }
      return CMBlockBufferCopyDataBytes(
        blockBuffer,
        atOffset: 0,
        dataLength: byteCount,
        destination: baseAddress,
      )
    }
    guard result == kCMBlockBufferNoErr else {
      throw ExportError.exportFailed("Could not read compressed sample bytes")
    }
    hasher.update(data: bytes)
  }

  guard reader.status == .completed else {
    throw ExportError.exportFailed(
      reader.error?.localizedDescription ?? "Sample reader did not complete")
  }

  return SampleStats(
    encodedSampleCount: encodedSampleCount,
    digest: hasher.finalize().map { String(format: "%02x", $0) }.joined(),
  )
}

private func decodedFrameStats(
  asset: AVAsset,
  track: AVAssetTrack,
  timeRange: CMTimeRange,
) throws -> DecodedFrameStats {
  let reader = try AVAssetReader(asset: asset)
  reader.timeRange = timeRange
  let output = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA],
  )
  output.alwaysCopiesSampleData = false
  guard reader.canAdd(output) else {
    throw ExportError.exportFailed("Cannot decode frames from video track")
  }
  reader.add(output)
  guard reader.startReading() else {
    throw ExportError.exportFailed(
      reader.error?.localizedDescription ?? "Could not start frame reader")
  }

  var frameCount = 0
  var presentationTimes: [Double] = []
  while let sampleBuffer = output.copyNextSampleBuffer() {
    frameCount += CMSampleBufferGetNumSamples(sampleBuffer)
    presentationTimes.append(CMTimeGetSeconds(CMSampleBufferGetPresentationTimeStamp(sampleBuffer)))
  }
  guard reader.status == .completed else {
    throw ExportError.exportFailed(
      reader.error?.localizedDescription ?? "Frame reader did not complete")
  }

  let sortedTimes = presentationTimes.sorted()
  let frameIntervals = zip(sortedTimes, sortedTimes.dropFirst())
    .map { $1 - $0 }
    .filter { $0 > 0.000_001 }
    .sorted()
  let medianInterval = frameIntervals.isEmpty ? 0 : frameIntervals[frameIntervals.count / 2]
  let framesPerSecond = medianInterval > 0 ? 1.0 / medianInterval : 0

  return DecodedFrameStats(
    frameCount: frameCount,
    framesPerSecond: framesPerSecond,
  )
}

private func metadata(
  for asset: AVAsset,
  timeRange: CMTimeRange? = nil,
) async throws -> VideoMetadata {
  let tracks = try await asset.loadTracks(withMediaType: .video)
  guard let track = tracks.first else {
    throw ExportError.missingVideoTrack("Missing video track in \(asset)")
  }

  async let naturalSize = track.load(.naturalSize)
  async let preferredTransform = track.load(.preferredTransform)
  async let estimatedDataRate = track.load(.estimatedDataRate)
  async let formatDescriptions = track.load(.formatDescriptions)
  async let assetDuration = asset.load(.duration)

  let transformedSize = (try await naturalSize).applying(try await preferredTransform)
  guard let formatDescription = try await formatDescriptions.first else {
    throw ExportError.missingVideoTrack("Missing video format description in \(asset)")
  }
  let extensions = CMFormatDescriptionGetExtensions(formatDescription) as? [String: Any] ?? [:]
  let loadedAssetDuration = try await assetDuration
  let selectedRange = timeRange ?? CMTimeRange(start: .zero, duration: loadedAssetDuration)
  let samples = try encodedSampleStats(asset: asset, track: track, timeRange: selectedRange)
  let frames = try decodedFrameStats(asset: asset, track: track, timeRange: selectedRange)
  let verbatimSampleEntry =
    dataExtension(
      extensions,
      key: kCMFormatDescriptionExtension_VerbatimISOSampleEntry,
    ) ?? Data()

  return VideoMetadata(
    codec: codecString(formatDescription: formatDescription, extensions: extensions),
    width: Int(abs(transformedSize.width.rounded())),
    height: Int(abs(transformedSize.height.rounded())),
    framesPerSecond: frames.framesPerSecond,
    frameCount: frames.frameCount,
    encodedSampleCount: samples.encodedSampleCount,
    durationSeconds: CMTimeGetSeconds(selectedRange.duration),
    bitrate: Int((try await estimatedDataRate).rounded()),
    colorPrimaries: extensionString(extensions, key: kCMFormatDescriptionExtension_ColorPrimaries),
    transferFunction: extensionString(
      extensions, key: kCMFormatDescriptionExtension_TransferFunction),
    yCbCrMatrix: extensionString(extensions, key: kCMFormatDescriptionExtension_YCbCrMatrix),
    formatDescriptionDigest: sha256(verbatimSampleEntry),
    sampleDigest: samples.digest,
  )
}

private func metadataMatches(_ source: VideoMetadata, _ candidate: VideoMetadata) -> Bool {
  source.codec == candidate.codec && source.width == candidate.width
    && source.height == candidate.height
    && abs(source.framesPerSecond - candidate.framesPerSecond) < 0.001
    && source.frameCount == candidate.frameCount && candidate.frameCount == 83
    && source.encodedSampleCount == candidate.encodedSampleCount
    && abs(candidate.durationSeconds - CMTimeGetSeconds(typingDuration)) < 0.000_001
    && source.colorPrimaries == candidate.colorPrimaries
    && source.transferFunction == candidate.transferFunction
    && source.yCbCrMatrix == candidate.yCbCrMatrix
    && source.formatDescriptionDigest == candidate.formatDescriptionDigest
}

private func exportPassthrough(input: URL, output: URL) async throws {
  let asset = AVURLAsset(url: input)
  guard let session = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetPassthrough)
  else {
    throw ExportError.unavailablePreset(
      "Passthrough export is unavailable for \(input.lastPathComponent)")
  }

  session.outputURL = output
  session.outputFileType = .mp4
  session.shouldOptimizeForNetworkUse = true
  session.timeRange = CMTimeRange(start: typingStart, duration: typingDuration)

  do {
    try await session.export(to: output, as: .mp4)
  } catch {
    throw ExportError.exportFailed(
      "Failed to export \(input.lastPathComponent): \(error.localizedDescription)",
    )
  }
}

private func writePNG(_ image: CGImage, to url: URL) throws {
  guard
    let destination = CGImageDestinationCreateWithURL(
      url as CFURL,
      UTType.png.identifier as CFString,
      1,
      nil,
    )
  else {
    throw ExportError.frameCaptureFailed("Could not create PNG destination at \(url.path)")
  }
  CGImageDestinationAddImage(destination, image, nil)
  guard CGImageDestinationFinalize(destination) else {
    throw ExportError.frameCaptureFailed("Could not write PNG at \(url.path)")
  }
}

private func captureFrame(asset: AVAsset, time: CMTime, output: URL) async throws {
  let generator = AVAssetImageGenerator(asset: asset)
  generator.appliesPreferredTrackTransform = true
  generator.requestedTimeToleranceBefore = .zero
  generator.requestedTimeToleranceAfter = .zero
  do {
    let (image, actualTime) = try await generator.image(at: time)
    guard abs(CMTimeGetSeconds(CMTimeSubtract(actualTime, time))) < 0.000_001 else {
      throw ExportError.frameCaptureFailed(
        "Frame at \(CMTimeGetSeconds(time)) resolved to \(CMTimeGetSeconds(actualTime))",
      )
    }
    try writePNG(image, to: output)
  } catch let error as ExportError {
    throw error
  } catch {
    throw ExportError.frameCaptureFailed(
      "Could not capture \(output.lastPathComponent): \(error.localizedDescription)",
    )
  }
}

private func run(_ arguments: Arguments) async throws {
  let fileManager = FileManager.default
  let stateDirectory = arguments.assetsRoot.appendingPathComponent(
    "razorsense-states", isDirectory: true)
  let referenceDirectory = arguments.frameDirectory.appendingPathComponent(
    "reference", isDirectory: true)
  let candidateDirectory = arguments.frameDirectory.appendingPathComponent(
    "candidate", isDirectory: true)

  try fileManager.createDirectory(at: arguments.outputDirectory, withIntermediateDirectories: true)
  try fileManager.createDirectory(at: referenceDirectory, withIntermediateDirectories: true)
  try fileManager.createDirectory(at: candidateDirectory, withIntermediateDirectories: true)

  for fileName in typingFiles.sorted() {
    let input = stateDirectory.appendingPathComponent(fileName)
    let output = arguments.outputDirectory.appendingPathComponent(fileName)
    guard fileManager.fileExists(atPath: input.path) else {
      throw ExportError.missingInput("Missing input: \(input.path)")
    }
    guard !fileManager.fileExists(atPath: output.path) else {
      throw ExportError.outputCollision("Output already exists: \(output.path)")
    }

    let sourceAsset = AVURLAsset(url: input)
    let sourceDuration = try await sourceAsset.load(.duration)
    guard CMTimeCompare(sourceDuration, typingSourceEnd) >= 0 else {
      throw ExportError.invalidArguments(
        "\(fileName) is already trimmed. Pass --assets-root pointing to the backed-up 10-second Typing masters.",
      )
    }
    let sourceMetadata = try await metadata(
      for: sourceAsset,
      timeRange: CMTimeRange(start: typingStart, duration: typingDuration),
    )
    let oldBytes = try fileSize(at: input)

    try await exportPassthrough(input: input, output: output)

    let candidateAsset = AVURLAsset(url: output)
    let candidateMetadata = try await metadata(for: candidateAsset)
    let newBytes = try fileSize(at: output)
    let samplesMatch = sourceMetadata.sampleDigest == candidateMetadata.sampleDigest
    let matches = metadataMatches(sourceMetadata, candidateMetadata)
    let report = ExportReport(
      input: input.path,
      output: output.path,
      preset: AVAssetExportPresetPassthrough,
      start: "167/25",
      duration: "83/25",
      oldBytes: oldBytes,
      newBytes: newBytes,
      savedBytes: oldBytes - newBytes,
      source: sourceMetadata,
      candidate: candidateMetadata,
      samplesMatch: samplesMatch,
      metadataMatches: matches,
    )
    guard samplesMatch else {
      throw ExportError.sampleMismatch("Compressed samples changed for \(fileName)")
    }
    guard matches else {
      throw ExportError.metadataMismatch("Video metadata changed for \(fileName)")
    }
    guard newBytes <= oldBytes else {
      throw ExportError.payloadIncrease(
        "Payload increased for \(fileName): \(oldBytes) -> \(newBytes)")
    }

    let baseName = input.deletingPathExtension().lastPathComponent
    for checkpoint in checkpoints {
      let frameName = "\(baseName)__\(checkpoint.name).png"
      let referenceOutput = referenceDirectory.appendingPathComponent(frameName)
      let candidateOutput = candidateDirectory.appendingPathComponent(frameName)
      guard !fileManager.fileExists(atPath: referenceOutput.path),
        !fileManager.fileExists(atPath: candidateOutput.path)
      else {
        throw ExportError.outputCollision("Frame output already exists: \(frameName)")
      }
      try await captureFrame(
        asset: sourceAsset,
        time: checkpoint.sourceTime,
        output: referenceOutput,
      )
      try await captureFrame(
        asset: candidateAsset,
        time: checkpoint.candidateTime,
        output: candidateOutput,
      )
    }

    let encoder = JSONEncoder()
    encoder.outputFormatting = [.sortedKeys, .withoutEscapingSlashes]
    let data = try encoder.encode(report)
    guard let line = String(data: data, encoding: .utf8) else {
      throw ExportError.exportFailed("Could not encode report for \(fileName)")
    }
    print(line)
  }
}

do {
  let arguments = try parseArguments(Array(CommandLine.arguments.dropFirst()))
  let semaphore = DispatchSemaphore(value: 0)
  var result: Result<Void, Error>?
  Task {
    do {
      try await run(arguments)
      result = .success(())
    } catch {
      result = .failure(error)
    }
    semaphore.signal()
  }
  semaphore.wait()
  if case .failure(let error) = result {
    throw error
  }
} catch {
  FileHandle.standardError.write(Data("error: \(error.localizedDescription)\n".utf8))
  exit(EXIT_FAILURE)
}

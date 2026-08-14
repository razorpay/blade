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

private struct MasterSpec {
  let fileName: String
  let sha256: String
  let codec: String
  let colorPrimaries: String
  let transferFunction: String
  let yCbCrMatrix: String
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
  let sourceSHA256: String
  let outputSHA256: String
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
  case unauthenticatedMaster(String)
  case unsupportedContainer(String)
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
      .unauthenticatedMaster(let message),
      .unsupportedContainer(let message),
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

private let masterSpecs = [
  MasterSpec(
    fileName: "razorsense-typing.mp4",
    sha256: "fd8facc2711148a60693279da4f28d6a75d1329f3adf904ba9d7163922f4ecc5",
    codec: "avc1.4D4029",
    colorPrimaries: "ITU_R_709_2",
    transferFunction: "ITU_R_709_2",
    yCbCrMatrix: "ITU_R_709_2",
  ),
  MasterSpec(
    fileName: "razorsense-typing-dark.mp4",
    sha256: "5e225bc0c273b86293c5a2185d5e2f33daff540a24673e39768bd126ca7b8490",
    codec: "avc1.640028",
    colorPrimaries: "unspecified",
    transferFunction: "unspecified",
    yCbCrMatrix: "unspecified",
  ),
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

private func fileSHA256(at url: URL) throws -> String {
  sha256(try Data(contentsOf: url, options: .mappedIfSafe))
}

private func readUInt32(_ data: Data, at offset: Int, limit: Int) throws -> UInt32 {
  guard offset >= 0, offset + 4 <= limit else {
    throw ExportError.unsupportedContainer("Truncated 32-bit ISO-BMFF field at byte \(offset)")
  }
  return data[offset..<offset + 4].reduce(UInt32(0)) { ($0 << 8) | UInt32($1) }
}

private func readUInt64(_ data: Data, at offset: Int, limit: Int) throws -> UInt64 {
  guard offset >= 0, offset + 8 <= limit else {
    throw ExportError.unsupportedContainer("Truncated 64-bit ISO-BMFF field at byte \(offset)")
  }
  return data[offset..<offset + 8].reduce(UInt64(0)) { ($0 << 8) | UInt64($1) }
}

private func boxType(_ data: Data, at offset: Int, limit: Int) throws -> String {
  guard offset >= 0, offset + 4 <= limit,
    let type = String(data: data[offset..<offset + 4], encoding: .ascii),
    type.utf8.allSatisfy({ $0 >= 0x20 && $0 <= 0x7E })
  else {
    throw ExportError.unsupportedContainer("Invalid ISO-BMFF box type at byte \(offset)")
  }
  return type
}

private let timestampBoxPaths: [String: [String]] = [
  "mvhd": ["moov", "mvhd"],
  "tkhd": ["moov", "trak", "tkhd"],
  "mdhd": ["moov", "trak", "mdia", "mdhd"],
]

private func zeroTimestampFields(
  in data: inout Data,
  boxType: String,
  payloadRange: Range<Int>,
) throws {
  guard payloadRange.count >= 4 else {
    throw ExportError.unsupportedContainer("\(boxType) is missing its full-box header")
  }
  let version = data[payloadRange.lowerBound]
  let fields: Range<Int>
  switch version {
  case 0:
    fields = payloadRange.lowerBound + 4..<payloadRange.lowerBound + 12
  case 1:
    fields = payloadRange.lowerBound + 4..<payloadRange.lowerBound + 20
  default:
    throw ExportError.unsupportedContainer(
      "Unsupported \(boxType) version \(version); refusing to patch unknown timestamp layout",
    )
  }
  guard fields.upperBound <= payloadRange.upperBound else {
    throw ExportError.unsupportedContainer("Truncated \(boxType) timestamp fields")
  }
  data.replaceSubrange(fields, with: repeatElement(UInt8(0), count: fields.count))
}

private func normalizeTimestampBoxes(
  in data: inout Data,
  range: Range<Int>,
  parentPath: [String],
  normalizedCounts: inout [String: Int],
) throws {
  var offset = range.lowerBound
  while offset < range.upperBound {
    guard range.upperBound - offset >= 8 else {
      throw ExportError.unsupportedContainer("Truncated ISO-BMFF box header at byte \(offset)")
    }

    let compactSize = try readUInt32(data, at: offset, limit: range.upperBound)
    let type = try boxType(data, at: offset + 4, limit: range.upperBound)
    var headerSize = 8
    let boxSize: Int
    switch compactSize {
    case 0:
      boxSize = range.upperBound - offset
    case 1:
      let extendedSize = try readUInt64(data, at: offset + 8, limit: range.upperBound)
      guard extendedSize <= UInt64(Int.max) else {
        throw ExportError.unsupportedContainer("Oversized \(type) box")
      }
      boxSize = Int(extendedSize)
      headerSize = 16
    default:
      boxSize = Int(compactSize)
    }
    if type == "uuid" { headerSize += 16 }
    guard boxSize >= headerSize, offset <= range.upperBound - boxSize else {
      throw ExportError.unsupportedContainer(
        "Invalid \(type) box size \(boxSize) at byte \(offset)")
    }

    let boxEnd = offset + boxSize
    let payloadRange = offset + headerSize..<boxEnd
    let path = parentPath + [type]
    if let expectedPath = timestampBoxPaths[type] {
      guard path == expectedPath else {
        throw ExportError.unsupportedContainer(
          "Unexpected \(type) layout at \(path.joined(separator: "/"))",
        )
      }
      try zeroTimestampFields(in: &data, boxType: type, payloadRange: payloadRange)
      normalizedCounts[type, default: 0] += 1
    }

    if type == "moov" || type == "trak" || type == "mdia" {
      try normalizeTimestampBoxes(
        in: &data,
        range: payloadRange,
        parentPath: path,
        normalizedCounts: &normalizedCounts,
      )
    }
    offset = boxEnd
  }
}

private func normalizeISOBaseMediaTimestamps(at url: URL) throws {
  var data = try Data(contentsOf: url)
  var counts: [String: Int] = [:]
  try normalizeTimestampBoxes(
    in: &data,
    range: data.startIndex..<data.endIndex,
    parentPath: [],
    normalizedCounts: &counts,
  )
  guard timestampBoxPaths.keys.allSatisfy({ counts[$0] == 1 }), counts.count == 3 else {
    throw ExportError.unsupportedContainer(
      "Expected exactly one mvhd, tkhd, and mdhd timestamp box; found \(counts)",
    )
  }
  try data.write(to: url, options: .atomic)
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

private func authenticateMaster(
  _ spec: MasterSpec,
  at url: URL,
) async throws -> String {
  let digest = try fileSHA256(at: url)
  guard digest == spec.sha256 else {
    throw ExportError.unauthenticatedMaster(
      "Rejected \(spec.fileName): SHA-256 \(digest) does not match authoritative master \(spec.sha256)",
    )
  }

  let sourceMetadata = try await metadata(for: AVURLAsset(url: url))
  var mismatches: [String] = []
  if abs(sourceMetadata.durationSeconds - 10) > 0.000_001 {
    mismatches.append("duration=\(sourceMetadata.durationSeconds), expected 10")
  }
  if sourceMetadata.width != 1920 || sourceMetadata.height != 1080 {
    mismatches.append(
      "geometry=\(sourceMetadata.width)x\(sourceMetadata.height), expected 1920x1080",
    )
  }
  if abs(sourceMetadata.framesPerSecond - 25) > 0.001 {
    mismatches.append("fps=\(sourceMetadata.framesPerSecond), expected 25")
  }
  if sourceMetadata.frameCount != 250 {
    mismatches.append("visibleFrames=\(sourceMetadata.frameCount), expected 250")
  }
  if sourceMetadata.codec != spec.codec {
    mismatches.append("codec=\(sourceMetadata.codec), expected \(spec.codec)")
  }
  if sourceMetadata.colorPrimaries != spec.colorPrimaries {
    mismatches.append(
      "colorPrimaries=\(sourceMetadata.colorPrimaries), expected \(spec.colorPrimaries)",
    )
  }
  if sourceMetadata.transferFunction != spec.transferFunction {
    mismatches.append(
      "transferFunction=\(sourceMetadata.transferFunction), expected \(spec.transferFunction)",
    )
  }
  if sourceMetadata.yCbCrMatrix != spec.yCbCrMatrix {
    mismatches.append("yCbCrMatrix=\(sourceMetadata.yCbCrMatrix), expected \(spec.yCbCrMatrix)")
  }
  guard mismatches.isEmpty else {
    throw ExportError.unauthenticatedMaster(
      "Rejected \(spec.fileName): \(mismatches.joined(separator: "; "))",
    )
  }
  return digest
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
  try normalizeISOBaseMediaTimestamps(at: output)
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

  for spec in masterSpecs.sorted(by: { $0.fileName < $1.fileName }) {
    let fileName = spec.fileName
    let input = stateDirectory.appendingPathComponent(fileName)
    let output = arguments.outputDirectory.appendingPathComponent(fileName)
    guard fileManager.fileExists(atPath: input.path) else {
      throw ExportError.missingInput("Missing input: \(input.path)")
    }
    guard !fileManager.fileExists(atPath: output.path) else {
      throw ExportError.outputCollision("Output already exists: \(output.path)")
    }

    let sourceAsset = AVURLAsset(url: input)
    let sourceSHA256 = try await authenticateMaster(spec, at: input)
    let sourceMetadata = try await metadata(
      for: sourceAsset,
      timeRange: CMTimeRange(start: typingStart, duration: typingDuration),
    )
    let oldBytes = try fileSize(at: input)

    try await exportPassthrough(input: input, output: output)

    let candidateAsset = AVURLAsset(url: output)
    let candidateMetadata = try await metadata(for: candidateAsset)
    let newBytes = try fileSize(at: output)
    let outputSHA256 = try fileSHA256(at: output)
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
      sourceSHA256: sourceSHA256,
      outputSHA256: outputSHA256,
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

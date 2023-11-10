export const pnpmLockCode = `
lockfileVersion: '6.0'

settings:
  autoInstallPeers: false
  excludeLinksFromLockfile: false

dependencies:
  '@razorpay/blade':
    specifier: '*'
    version: 10.17.4(react-dom@18.2.0)(react@18.2.0)(styled-components@5.3.11)
  '@types/react':
    specifier: ^18
    version: 18.2.37
  '@types/react-dom':
    specifier: ^18
    version: 18.2.15
  react:
    specifier: ^18
    version: 18.2.0
  react-dom:
    specifier: ^18
    version: 18.2.0(react@18.2.0)
  styled-components:
    specifier: ^5
    version: 5.3.11(react-dom@18.2.0)(react@18.2.0)

devDependencies:
  '@vitejs/plugin-react':
    specifier: 4.1.1
    version: 4.1.1(vite@4.5.0)
  vite:
    specifier: 4.5.0
    version: 4.5.0

packages:

  /@ampproject/remapping@2.2.1:
    resolution: {integrity: sha512-lFMjJTrFL3j7L9yBxwYfCq2k6qqwHyzuUl/XBnif78PWTJYyL/dfowQHWE3sp6U6ZzqWiiIZnpTMO96zhkjwtg==}
    engines: {node: '>=6.0.0'}
    dependencies:
      '@jridgewell/gen-mapping': 0.3.3
      '@jridgewell/trace-mapping': 0.3.20
    dev: true

  /@babel/code-frame@7.22.13:
    resolution: {integrity: sha512-XktuhWlJ5g+3TJXc5upd9Ks1HutSArik6jf2eAjYFyIOf4ej3RN+184cZbzDvbPnuTJIUhPKKJE3cIsYTiAT3w==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/highlight': 7.22.20
      chalk: 2.4.2

  /@babel/compat-data@7.23.3:
    resolution: {integrity: sha512-BmR4bWbDIoFJmJ9z2cZ8Gmm2MXgEDgjdWgpKmKWUt54UGFJdlj31ECtbaDvCG/qVdG3AQ1SfpZEs01lUFbzLOQ==}
    engines: {node: '>=6.9.0'}
    dev: true

  /@babel/core@7.23.3:
    resolution: {integrity: sha512-Jg+msLuNuCJDyBvFv5+OKOUjWMZgd85bKjbICd3zWrKAo+bJ49HJufi7CQE0q0uR8NGyO6xkCACScNqyjHSZew==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@ampproject/remapping': 2.2.1
      '@babel/code-frame': 7.22.13
      '@babel/generator': 7.23.3
      '@babel/helper-compilation-targets': 7.22.15
      '@babel/helper-module-transforms': 7.23.3(@babel/core@7.23.3)
      '@babel/helpers': 7.23.2
      '@babel/parser': 7.23.3
      '@babel/template': 7.22.15
      '@babel/traverse': 7.23.3(supports-color@5.5.0)
      '@babel/types': 7.23.3
      convert-source-map: 2.0.0
      debug: 4.3.4(supports-color@5.5.0)
      gensync: 1.0.0-beta.2
      json5: 2.2.3
      semver: 6.3.1
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@babel/generator@7.23.3:
    resolution: {integrity: sha512-keeZWAV4LU3tW0qRi19HRpabC/ilM0HRBBzf9/k8FFiG4KVpiv0FIy4hHfLfFQZNhziCTPTmd59zoyv6DNISzg==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/types': 7.23.3
      '@jridgewell/gen-mapping': 0.3.3
      '@jridgewell/trace-mapping': 0.3.20
      jsesc: 2.5.2

  /@babel/helper-annotate-as-pure@7.22.5:
    resolution: {integrity: sha512-LvBTxu8bQSQkcyKOU+a1btnNFQ1dMAd0R6PyW3arXes06F6QLWLIrd681bxRPIXlrMGR3XYnW9JyML7dP3qgxg==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/types': 7.23.3
    dev: false

  /@babel/helper-compilation-targets@7.22.15:
    resolution: {integrity: sha512-y6EEzULok0Qvz8yyLkCvVX+02ic+By2UdOhylwUOvOn9dvYc9mKICJuuU1n1XBI02YWsNsnrY1kc6DVbjcXbtw==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/compat-data': 7.23.3
      '@babel/helper-validator-option': 7.22.15
      browserslist: 4.22.1
      lru-cache: 5.1.1
      semver: 6.3.1
    dev: true

  /@babel/helper-environment-visitor@7.22.20:
    resolution: {integrity: sha512-zfedSIzFhat/gFhWfHtgWvlec0nqB9YEIVrpuwjruLlXfUSnA8cJB0miHKwqDnQ7d32aKo2xt88/xZptwxbfhA==}
    engines: {node: '>=6.9.0'}

  /@babel/helper-function-name@7.23.0:
    resolution: {integrity: sha512-OErEqsrxjZTJciZ4Oo+eoZqeW9UIiOcuYKRJA4ZAgV9myA+pOXhhmpfNCKjEH/auVfEYVFJ6y1Tc4r0eIApqiw==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/template': 7.22.15
      '@babel/types': 7.23.3

  /@babel/helper-hoist-variables@7.22.5:
    resolution: {integrity: sha512-wGjk9QZVzvknA6yKIUURb8zY3grXCcOZt+/7Wcy8O2uctxhplmUPkOdlgoNhmdVee2c92JXbf1xpMtVNbfoxRw==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/types': 7.23.3

  /@babel/helper-module-imports@7.22.15:
    resolution: {integrity: sha512-0pYVBnDKZO2fnSPCrgM/6WMc7eS20Fbok+0r88fp+YtWVLZrp4CkafFGIp+W0VKw4a22sgebPT99y+FDNMdP4w==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/types': 7.23.3

  /@babel/helper-module-transforms@7.23.3(@babel/core@7.23.3):
    resolution: {integrity: sha512-7bBs4ED9OmswdfDzpz4MpWgSrV7FXlc3zIagvLFjS5H+Mk7Snr21vQ6QwrsoCGMfNC4e4LQPdoULEt4ykz0SRQ==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0
    dependencies:
      '@babel/core': 7.23.3
      '@babel/helper-environment-visitor': 7.22.20
      '@babel/helper-module-imports': 7.22.15
      '@babel/helper-simple-access': 7.22.5
      '@babel/helper-split-export-declaration': 7.22.6
      '@babel/helper-validator-identifier': 7.22.20
    dev: true

  /@babel/helper-plugin-utils@7.22.5:
    resolution: {integrity: sha512-uLls06UVKgFG9QD4OeFYLEGteMIAa5kpTPcFL28yuCIIzsf6ZyKZMllKVOCZFhiZ5ptnwX4mtKdWCBE/uT4amg==}
    engines: {node: '>=6.9.0'}

  /@babel/helper-simple-access@7.22.5:
    resolution: {integrity: sha512-n0H99E/K+Bika3++WNL17POvo4rKWZ7lZEp1Q+fStVbUi8nxPQEBOlTmCOxW/0JsS56SKKQ+ojAe2pHKJHN35w==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/types': 7.23.3
    dev: true

  /@babel/helper-split-export-declaration@7.22.6:
    resolution: {integrity: sha512-AsUnxuLhRYsisFiaJwvp1QF+I3KjD5FOxut14q/GzovUe6orHLesW2C7d754kRm53h5gqrz6sFl6sxc4BVtE/g==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/types': 7.23.3

  /@babel/helper-string-parser@7.22.5:
    resolution: {integrity: sha512-mM4COjgZox8U+JcXQwPijIZLElkgEpO5rsERVDJTc2qfCDfERyob6k5WegS14SX18IIjv+XD+GrqNumY5JRCDw==}
    engines: {node: '>=6.9.0'}

  /@babel/helper-validator-identifier@7.22.20:
    resolution: {integrity: sha512-Y4OZ+ytlatR8AI+8KZfKuL5urKp7qey08ha31L8b3BwewJAoJamTzyvxPR/5D+KkdJCGPq/+8TukHBlY10FX9A==}
    engines: {node: '>=6.9.0'}

  /@babel/helper-validator-option@7.22.15:
    resolution: {integrity: sha512-bMn7RmyFjY/mdECUbgn9eoSY4vqvacUnS9i9vGAGttgFWesO6B4CYWA7XlpbWgBt71iv/hfbPlynohStqnu5hA==}
    engines: {node: '>=6.9.0'}
    dev: true

  /@babel/helpers@7.23.2:
    resolution: {integrity: sha512-lzchcp8SjTSVe/fPmLwtWVBFC7+Tbn8LGHDVfDp9JGxpAY5opSaEFgt8UQvrnECWOTdji2mOWMz1rOhkHscmGQ==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/template': 7.22.15
      '@babel/traverse': 7.23.3(supports-color@5.5.0)
      '@babel/types': 7.23.3
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@babel/highlight@7.22.20:
    resolution: {integrity: sha512-dkdMCN3py0+ksCgYmGG8jKeGA/8Tk+gJwSYYlFGxG5lmhfKNoAy004YpLxpS1W2J8m/EK2Ew+yOs9pVRwO89mg==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/helper-validator-identifier': 7.22.20
      chalk: 2.4.2
      js-tokens: 4.0.0

  /@babel/parser@7.23.3:
    resolution: {integrity: sha512-uVsWNvlVsIninV2prNz/3lHCb+5CJ+e+IUBfbjToAHODtfGYLfCFuY4AU7TskI+dAKk+njsPiBjq1gKTvZOBaw==}
    engines: {node: '>=6.0.0'}
    hasBin: true
    dependencies:
      '@babel/types': 7.23.3

  /@babel/plugin-syntax-jsx@7.23.3:
    resolution: {integrity: sha512-EB2MELswq55OHUoRZLGg/zC7QWUKfNLpE57m/S2yr1uEneIgsTgrSzXP3NXEsMkVn76OlaVVnzN+ugObuYGwhg==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0
    dependencies:
      '@babel/helper-plugin-utils': 7.22.5
    dev: false

  /@babel/plugin-transform-react-jsx-self@7.23.3(@babel/core@7.23.3):
    resolution: {integrity: sha512-qXRvbeKDSfwnlJnanVRp0SfuWE5DQhwQr5xtLBzp56Wabyo+4CMosF6Kfp+eOD/4FYpql64XVJ2W0pVLlJZxOQ==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0
    dependencies:
      '@babel/core': 7.23.3
      '@babel/helper-plugin-utils': 7.22.5
    dev: true

  /@babel/plugin-transform-react-jsx-source@7.23.3(@babel/core@7.23.3):
    resolution: {integrity: sha512-91RS0MDnAWDNvGC6Wio5XYkyWI39FMFO+JK9+4AlgaTH+yWwVTsw7/sn6LK0lH7c5F+TFkpv/3LfCJ1Ydwof/g==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0
    dependencies:
      '@babel/core': 7.23.3
      '@babel/helper-plugin-utils': 7.22.5
    dev: true

  /@babel/runtime@7.20.0:
    resolution: {integrity: sha512-NDYdls71fTXoU8TZHfbBWg7DiZfNzClcKui/+kyi6ppD2L1qnWW3VV6CjtaBXSUGGhiTWJ6ereOIkUvenif66Q==}
    engines: {node: '>=6.9.0'}
    dependencies:
      regenerator-runtime: 0.13.11
    dev: false

  /@babel/template@7.22.15:
    resolution: {integrity: sha512-QPErUVm4uyJa60rkI73qneDacvdvzxshT3kksGqlGWYdOTIUOwJ7RDUL8sGqslY1uXWSL6xMFKEXDS3ox2uF0w==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/code-frame': 7.22.13
      '@babel/parser': 7.23.3
      '@babel/types': 7.23.3

  /@babel/traverse@7.23.3(supports-color@5.5.0):
    resolution: {integrity: sha512-+K0yF1/9yR0oHdE0StHuEj3uTPzwwbrLGfNOndVJVV2TqA5+j3oljJUb4nmB954FLGjNem976+B+eDuLIjesiQ==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/code-frame': 7.22.13
      '@babel/generator': 7.23.3
      '@babel/helper-environment-visitor': 7.22.20
      '@babel/helper-function-name': 7.23.0
      '@babel/helper-hoist-variables': 7.22.5
      '@babel/helper-split-export-declaration': 7.22.6
      '@babel/parser': 7.23.3
      '@babel/types': 7.23.3
      debug: 4.3.4(supports-color@5.5.0)
      globals: 11.12.0
    transitivePeerDependencies:
      - supports-color

  /@babel/types@7.23.3:
    resolution: {integrity: sha512-OZnvoH2l8PK5eUvEcUyCt/sXgr/h+UWpVuBbOljwcrAgUl6lpchoQ++PHGyQy1AtYnVA6CEq3y5xeEI10brpXw==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/helper-string-parser': 7.22.5
      '@babel/helper-validator-identifier': 7.22.20
      to-fast-properties: 2.0.0

  /@emotion/is-prop-valid@1.2.1:
    resolution: {integrity: sha512-61Mf7Ufx4aDxx1xlDeOm8aFFigGHE4z+0sKCa+IHCeZKiyP9RLD0Mmx7m8b9/Cf37f7NAvQOOJAbQQGVr5uERw==}
    dependencies:
      '@emotion/memoize': 0.8.1
    dev: false

  /@emotion/memoize@0.8.1:
    resolution: {integrity: sha512-W2P2c/VRW1/1tLox0mVUalvnWXxavmv/Oum2aPsRcoDJuob75FC3Y8FbpfLwUegRcxINtGUMPq0tFCvYNTBXNA==}
    dev: false

  /@emotion/stylis@0.8.5:
    resolution: {integrity: sha512-h6KtPihKFn3T9fuIrwvXXUOwlx3rfUvfZIcP5a6rh8Y7zjE3O06hT5Ss4S/YI1AYhuZ1kjaE/5EaOOI2NqSylQ==}
    dev: false

  /@emotion/unitless@0.7.5:
    resolution: {integrity: sha512-OWORNpfjMsSSUBVrRBVGECkhWcULOAJz9ZW8uK9qgxD+87M7jHRcvh/A96XXNhXTLmKcoYSQtBEX7lHMO7YRwg==}
    dev: false

  /@esbuild/android-arm64@0.18.20:
    resolution: {integrity: sha512-Nz4rJcchGDtENV0eMKUNa6L12zz2zBDXuhj/Vjh18zGqB44Bi7MBMSXjgunJgjRhCmKOjnPuZp4Mb6OKqtMHLQ==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [android]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/android-arm@0.18.20:
    resolution: {integrity: sha512-fyi7TDI/ijKKNZTUJAQqiG5T7YjJXgnzkURqmGj13C6dCqckZBLdl4h7bkhHt/t0WP+zO9/zwroDvANaOqO5Sw==}
    engines: {node: '>=12'}
    cpu: [arm]
    os: [android]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/android-x64@0.18.20:
    resolution: {integrity: sha512-8GDdlePJA8D6zlZYJV/jnrRAi6rOiNaCC/JclcXpB+KIuvfBN4owLtgzY2bsxnx666XjJx2kDPUmnTtR8qKQUg==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [android]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/darwin-arm64@0.18.20:
    resolution: {integrity: sha512-bxRHW5kHU38zS2lPTPOyuyTm+S+eobPUnTNkdJEfAddYgEcll4xkT8DB9d2008DtTbl7uJag2HuE5NZAZgnNEA==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [darwin]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/darwin-x64@0.18.20:
    resolution: {integrity: sha512-pc5gxlMDxzm513qPGbCbDukOdsGtKhfxD1zJKXjCCcU7ju50O7MeAZ8c4krSJcOIJGFR+qx21yMMVYwiQvyTyQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [darwin]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/freebsd-arm64@0.18.20:
    resolution: {integrity: sha512-yqDQHy4QHevpMAaxhhIwYPMv1NECwOvIpGCZkECn8w2WFHXjEwrBn3CeNIYsibZ/iZEUemj++M26W3cNR5h+Tw==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [freebsd]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/freebsd-x64@0.18.20:
    resolution: {integrity: sha512-tgWRPPuQsd3RmBZwarGVHZQvtzfEBOreNuxEMKFcd5DaDn2PbBxfwLcj4+aenoh7ctXcbXmOQIn8HI6mCSw5MQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [freebsd]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-arm64@0.18.20:
    resolution: {integrity: sha512-2YbscF+UL7SQAVIpnWvYwM+3LskyDmPhe31pE7/aoTMFKKzIc9lLbyGUpmmb8a8AixOL61sQ/mFh3jEjHYFvdA==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-arm@0.18.20:
    resolution: {integrity: sha512-/5bHkMWnq1EgKr1V+Ybz3s1hWXok7mDFUMQ4cG10AfW3wL02PSZi5kFpYKrptDsgb2WAJIvRcDm+qIvXf/apvg==}
    engines: {node: '>=12'}
    cpu: [arm]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-ia32@0.18.20:
    resolution: {integrity: sha512-P4etWwq6IsReT0E1KHU40bOnzMHoH73aXp96Fs8TIT6z9Hu8G6+0SHSw9i2isWrD2nbx2qo5yUqACgdfVGx7TA==}
    engines: {node: '>=12'}
    cpu: [ia32]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-loong64@0.18.20:
    resolution: {integrity: sha512-nXW8nqBTrOpDLPgPY9uV+/1DjxoQ7DoB2N8eocyq8I9XuqJ7BiAMDMf9n1xZM9TgW0J8zrquIb/A7s3BJv7rjg==}
    engines: {node: '>=12'}
    cpu: [loong64]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-mips64el@0.18.20:
    resolution: {integrity: sha512-d5NeaXZcHp8PzYy5VnXV3VSd2D328Zb+9dEq5HE6bw6+N86JVPExrA6O68OPwobntbNJ0pzCpUFZTo3w0GyetQ==}
    engines: {node: '>=12'}
    cpu: [mips64el]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-ppc64@0.18.20:
    resolution: {integrity: sha512-WHPyeScRNcmANnLQkq6AfyXRFr5D6N2sKgkFo2FqguP44Nw2eyDlbTdZwd9GYk98DZG9QItIiTlFLHJHjxP3FA==}
    engines: {node: '>=12'}
    cpu: [ppc64]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-riscv64@0.18.20:
    resolution: {integrity: sha512-WSxo6h5ecI5XH34KC7w5veNnKkju3zBRLEQNY7mv5mtBmrP/MjNBCAlsM2u5hDBlS3NGcTQpoBvRzqBcRtpq1A==}
    engines: {node: '>=12'}
    cpu: [riscv64]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-s390x@0.18.20:
    resolution: {integrity: sha512-+8231GMs3mAEth6Ja1iK0a1sQ3ohfcpzpRLH8uuc5/KVDFneH6jtAJLFGafpzpMRO6DzJ6AvXKze9LfFMrIHVQ==}
    engines: {node: '>=12'}
    cpu: [s390x]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/linux-x64@0.18.20:
    resolution: {integrity: sha512-UYqiqemphJcNsFEskc73jQ7B9jgwjWrSayxawS6UVFZGWrAAtkzjxSqnoclCXxWtfwLdzU+vTpcNYhpn43uP1w==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [linux]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/netbsd-x64@0.18.20:
    resolution: {integrity: sha512-iO1c++VP6xUBUmltHZoMtCUdPlnPGdBom6IrO4gyKPFFVBKioIImVooR5I83nTew5UOYrk3gIJhbZh8X44y06A==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [netbsd]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/openbsd-x64@0.18.20:
    resolution: {integrity: sha512-e5e4YSsuQfX4cxcygw/UCPIEP6wbIL+se3sxPdCiMbFLBWu0eiZOJ7WoD+ptCLrmjZBK1Wk7I6D/I3NglUGOxg==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [openbsd]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/sunos-x64@0.18.20:
    resolution: {integrity: sha512-kDbFRFp0YpTQVVrqUd5FTYmWo45zGaXe0X8E1G/LKFC0v8x0vWrhOWSLITcCn63lmZIxfOMXtCfti/RxN/0wnQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [sunos]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/win32-arm64@0.18.20:
    resolution: {integrity: sha512-ddYFR6ItYgoaq4v4JmQQaAI5s7npztfV4Ag6NrhiaW0RrnOXqBkgwZLofVTlq1daVTQNhtI5oieTvkRPfZrePg==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [win32]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/win32-ia32@0.18.20:
    resolution: {integrity: sha512-Wv7QBi3ID/rROT08SABTS7eV4hX26sVduqDOTe1MvGMjNd3EjOz4b7zeexIR62GTIEKrfJXKL9LFxTYgkyeu7g==}
    engines: {node: '>=12'}
    cpu: [ia32]
    os: [win32]
    requiresBuild: true
    dev: true
    optional: true

  /@esbuild/win32-x64@0.18.20:
    resolution: {integrity: sha512-kTdfRcSiDfQca/y9QIkng02avJ+NCaQvrMejlsB3RRv5sE9rRoeBPISaZpKxHELzRxZyLvNts1P27W3wV+8geQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [win32]
    requiresBuild: true
    dev: true
    optional: true

  /@floating-ui/core@1.5.0:
    resolution: {integrity: sha512-kK1h4m36DQ0UHGj5Ah4db7R0rHemTqqO0QLvUqi1/mUUp3LuAWbWxdxSIf/XsnH9VS6rRVPLJCncjRzUvyCLXg==}
    dependencies:
      '@floating-ui/utils': 0.1.6
    dev: false

  /@floating-ui/dom@1.5.3:
    resolution: {integrity: sha512-ClAbQnEqJAKCJOEbbLo5IUlZHkNszqhuxS4fHAVxRPXPya6Ysf2G8KypnYcOTpx6I8xcgF9bbHb6g/2KpbV8qA==}
    dependencies:
      '@floating-ui/core': 1.5.0
      '@floating-ui/utils': 0.1.6
    dev: false

  /@floating-ui/react-dom@2.0.4(react-dom@18.2.0)(react@18.2.0):
    resolution: {integrity: sha512-CF8k2rgKeh/49UrnIBs4BdxPUV6vize/Db1d/YbCLyp9GiVZ0BEwf5AiDSxJRCr6yOkGqTFHtmrULxkEfYZ7dQ==}
    peerDependencies:
      react: '>=16.8.0'
      react-dom: '>=16.8.0'
    dependencies:
      '@floating-ui/dom': 1.5.3
      react: 18.2.0
      react-dom: 18.2.0(react@18.2.0)
    dev: false

  /@floating-ui/react-native@0.10.1(react@18.2.0):
    resolution: {integrity: sha512-+GdYTrcZ9pD6+l63YU8hqCDZGsUeP4351kLY6dgjXUDYXYCr7M0rWnTWigVMOyafnDrTRXWxZxJbHo180+uFvQ==}
    peerDependencies:
      react: '>=16.8.0'
      react-native: '>=0.64.0'
    dependencies:
      '@floating-ui/core': 1.5.0
      react: 18.2.0
    dev: false

  /@floating-ui/react@0.25.4(react-dom@18.2.0)(react@18.2.0):
    resolution: {integrity: sha512-lWRQ/UiTvSIBxohn0/2HFHEmnmOVRjl7j6XcRJuLH0ls6f/9AyHMWVzkAJFuwx0n9gaEeCmg9VccCSCJzbEJig==}
    peerDependencies:
      react: '>=16.8.0'
      react-dom: '>=16.8.0'
    dependencies:
      '@floating-ui/react-dom': 2.0.4(react-dom@18.2.0)(react@18.2.0)
      '@floating-ui/utils': 0.1.6
      react: 18.2.0
      react-dom: 18.2.0(react@18.2.0)
      tabbable: 6.2.0
    dev: false

  /@floating-ui/utils@0.1.6:
    resolution: {integrity: sha512-OfX7E2oUDYxtBvsuS4e/jSn4Q9Qb6DzgeYtsAdkPZ47znpoNsMgZw0+tVijiv3uGNR6dgNlty6r9rzIzHjtd/A==}
    dev: false

  /@jridgewell/gen-mapping@0.3.3:
    resolution: {integrity: sha512-HLhSWOLRi875zjjMG/r+Nv0oCW8umGb0BgEhyX3dDX3egwZtB8PqLnjz3yedt8R5StBrzcg4aBpnh8UA9D1BoQ==}
    engines: {node: '>=6.0.0'}
    dependencies:
      '@jridgewell/set-array': 1.1.2
      '@jridgewell/sourcemap-codec': 1.4.15
      '@jridgewell/trace-mapping': 0.3.20

  /@jridgewell/resolve-uri@3.1.1:
    resolution: {integrity: sha512-dSYZh7HhCDtCKm4QakX0xFpsRDqjjtZf/kjI/v3T3Nwt5r8/qz/M19F9ySyOqU94SXBmeG9ttTul+YnR4LOxFA==}
    engines: {node: '>=6.0.0'}

  /@jridgewell/set-array@1.1.2:
    resolution: {integrity: sha512-xnkseuNADM0gt2bs+BvhO0p78Mk762YnZdsuzFV018NoG1Sj1SCQvpSqa7XUaTam5vAGasABV9qXASMKnFMwMw==}
    engines: {node: '>=6.0.0'}

  /@jridgewell/sourcemap-codec@1.4.15:
    resolution: {integrity: sha512-eF2rxCRulEKXHTRiDrDy6erMYWqNw4LPdQ8UQA4huuxaQsVeRPFl2oM8oDGxMFhJUWZf9McpLtJasDDZb/Bpeg==}

  /@jridgewell/trace-mapping@0.3.20:
    resolution: {integrity: sha512-R8LcPeWZol2zR8mmH3JeKQ6QRCFb7XgUhV9ZlGhHLGyg4wpPiPZNQOOWhFZhxKw8u//yTbNGI42Bx/3paXEQ+Q==}
    dependencies:
      '@jridgewell/resolve-uri': 3.1.1
      '@jridgewell/sourcemap-codec': 1.4.15

  /@razorpay/blade@10.17.4(react-dom@18.2.0)(react@18.2.0)(styled-components@5.3.11):
    resolution: {integrity: sha512-/cANu3J6IEFMjZfkql8lKuPO+UMt/P9cn685AuuHVfFGzpkQlshYVxrKhVH9XFD1R0XWsgn7aaBacx+XTpJrhQ==}
    engines: {node: '>=18.12.1'}
    hasBin: true
    requiresBuild: true
    peerDependencies:
      '@gorhom/bottom-sheet': ^4
      '@gorhom/portal': 1.0.14
      react: '>=18'
      react-dom: '>=18'
      react-native: ^0.72
      react-native-gesture-handler: ^2.9.0
      react-native-reanimated: ^3.4.1
      react-native-svg: ^12.3.0
      styled-components: ^5
    peerDependenciesMeta:
      '@gorhom/bottom-sheet':
        optional: true
      react-native:
        optional: true
      react-native-reanimated:
        optional: true
    dependencies:
      '@babel/runtime': 7.20.0
      '@floating-ui/react': 0.25.4(react-dom@18.2.0)(react@18.2.0)
      '@floating-ui/react-native': 0.10.1(react@18.2.0)
      '@types/body-scroll-lock': 3.1.0
      '@use-gesture/react': 10.2.24(react@18.2.0)
      body-scroll-lock: 4.0.0-beta.0
      patch-package: 7.0.0
      react: 18.2.0
      react-dom: 18.2.0(react@18.2.0)
      react-native-pager-view: 6.2.1(react@18.2.0)
      react-native-tab-view: 3.5.2(react-native-pager-view@6.2.1)(react@18.2.0)
      styled-components: 5.3.11(react-dom@18.2.0)(react@18.2.0)
      tinycolor2: 1.6.0
      use-presence: 1.1.0(react-dom@18.2.0)(react@18.2.0)
    dev: false

  /@types/babel__core@7.20.4:
    resolution: {integrity: sha512-mLnSC22IC4vcWiuObSRjrLd9XcBTGf59vUSoq2jkQDJ/QQ8PMI9rSuzE+aEV8karUMbskw07bKYoUJCKTUaygg==}
    dependencies:
      '@babel/parser': 7.23.3
      '@babel/types': 7.23.3
      '@types/babel__generator': 7.6.7
      '@types/babel__template': 7.4.4
      '@types/babel__traverse': 7.20.4
    dev: true

  /@types/babel__generator@7.6.7:
    resolution: {integrity: sha512-6Sfsq+EaaLrw4RmdFWE9Onp63TOUue71AWb4Gpa6JxzgTYtimbM086WnYTy2U67AofR++QKCo08ZP6pwx8YFHQ==}
    dependencies:
      '@babel/types': 7.23.3
    dev: true

  /@types/babel__template@7.4.4:
    resolution: {integrity: sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==}
    dependencies:
      '@babel/parser': 7.23.3
      '@babel/types': 7.23.3
    dev: true

  /@types/babel__traverse@7.20.4:
    resolution: {integrity: sha512-mSM/iKUk5fDDrEV/e83qY+Cr3I1+Q3qqTuEn++HAWYjEa1+NxZr6CNrcJGf2ZTnq4HoFGC3zaTPZTobCzCFukA==}
    dependencies:
      '@babel/types': 7.23.3
    dev: true

  /@types/body-scroll-lock@3.1.0:
    resolution: {integrity: sha512-3owAC4iJub5WPqRhxd8INarF2bWeQq1yQHBgYhN0XLBJMpd5ED10RrJ3aKiAwlTyL5wK7RkBD4SZUQz2AAAMdA==}
    dev: false

  /@types/prop-types@15.7.10:
    resolution: {integrity: sha512-mxSnDQxPqsZxmeShFH+uwQ4kO4gcJcGahjjMFeLbKE95IAZiiZyiEepGZjtXJ7hN/yfu0bu9xN2ajcU0JcxX6A==}
    dev: false

  /@types/react-dom@18.2.15:
    resolution: {integrity: sha512-HWMdW+7r7MR5+PZqJF6YFNSCtjz1T0dsvo/f1BV6HkV+6erD/nA7wd9NM00KVG83zf2nJ7uATPO9ttdIPvi3gg==}
    dependencies:
      '@types/react': 18.2.37
    dev: false

  /@types/react@18.2.37:
    resolution: {integrity: sha512-RGAYMi2bhRgEXT3f4B92WTohopH6bIXw05FuGlmJEnv/omEn190+QYEIYxIAuIBdKgboYYdVved2p1AxZVQnaw==}
    dependencies:
      '@types/prop-types': 15.7.10
      '@types/scheduler': 0.16.6
      csstype: 3.1.2
    dev: false

  /@types/scheduler@0.16.6:
    resolution: {integrity: sha512-Vlktnchmkylvc9SnwwwozTv04L/e1NykF5vgoQ0XTmI8DD+wxfjQuHuvHS3p0r2jz2x2ghPs2h1FVeDirIteWA==}
    dev: false

  /@use-gesture/core@10.2.24:
    resolution: {integrity: sha512-ZL7F9mgOn3Qlnp6QLI9jaOfcvqrx6JPE/BkdVSd8imveaFTm/a3udoO6f5Us/1XtqnL4347PsIiK6AtCvMHk2Q==}
    dev: false

  /@use-gesture/react@10.2.24(react@18.2.0):
    resolution: {integrity: sha512-rAZ8Nnpu1g4eFzqCPlaq+TppJpMy0dTpYOQx5KpfoBF4P3aWnCqwj7eKxcmdIb1NJKpIJj50DPugUH4mq5cpBg==}
    peerDependencies:
      react: '>= 16.8.0'
    dependencies:
      '@use-gesture/core': 10.2.24
      react: 18.2.0
    dev: false

  /@vitejs/plugin-react@4.1.1(vite@4.5.0):
    resolution: {integrity: sha512-Jie2HERK+uh27e+ORXXwEP5h0Y2lS9T2PRGbfebiHGlwzDO0dEnd2aNtOR/qjBlPb1YgxwAONeblL1xqLikLag==}
    engines: {node: ^14.18.0 || >=16.0.0}
    peerDependencies:
      vite: ^4.2.0
    dependencies:
      '@babel/core': 7.23.3
      '@babel/plugin-transform-react-jsx-self': 7.23.3(@babel/core@7.23.3)
      '@babel/plugin-transform-react-jsx-source': 7.23.3(@babel/core@7.23.3)
      '@types/babel__core': 7.20.4
      react-refresh: 0.14.0
      vite: 4.5.0
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@yarnpkg/lockfile@1.1.0:
    resolution: {integrity: sha512-GpSwvyXOcOOlV70vbnzjj4fW5xW/FdUF6nQEt1ENy7m4ZCczi1+/buVUPAqmGfqznsORNFzUMjctTIp8a9tuCQ==}
    dev: false

  /ansi-styles@3.2.1:
    resolution: {integrity: sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==}
    engines: {node: '>=4'}
    dependencies:
      color-convert: 1.9.3

  /ansi-styles@4.3.0:
    resolution: {integrity: sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==}
    engines: {node: '>=8'}
    dependencies:
      color-convert: 2.0.1
    dev: false

  /at-least-node@1.0.0:
    resolution: {integrity: sha512-+q/t7Ekv1EDY2l6Gda6LLiX14rU9TV20Wa3ofeQmwPFZbOMo9DXrLbOjFaaclkXKWidIaopwAObQDqwWtGUjqg==}
    engines: {node: '>= 4.0.0'}
    dev: false

  /babel-plugin-styled-components@2.1.4(styled-components@5.3.11):
    resolution: {integrity: sha512-Xgp9g+A/cG47sUyRwwYxGM4bR/jDRg5N6it/8+HxCnbT5XNKSKDT9xm4oag/osgqjC2It/vH0yXsomOG6k558g==}
    peerDependencies:
      styled-components: '>= 2'
    dependencies:
      '@babel/helper-annotate-as-pure': 7.22.5
      '@babel/helper-module-imports': 7.22.15
      '@babel/plugin-syntax-jsx': 7.23.3
      lodash: 4.17.21
      picomatch: 2.3.1
      styled-components: 5.3.11(react-dom@18.2.0)(react@18.2.0)
    transitivePeerDependencies:
      - '@babel/core'
    dev: false

  /balanced-match@1.0.2:
    resolution: {integrity: sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==}
    dev: false

  /body-scroll-lock@4.0.0-beta.0:
    resolution: {integrity: sha512-a7tP5+0Mw3YlUJcGAKUqIBkYYGlYxk2fnCasq/FUph1hadxlTRjF+gAcZksxANnaMnALjxEddmSi/H3OR8ugcQ==}
    dev: false

  /brace-expansion@1.1.11:
    resolution: {integrity: sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==}
    dependencies:
      balanced-match: 1.0.2
      concat-map: 0.0.1
    dev: false

  /braces@3.0.2:
    resolution: {integrity: sha512-b8um+L1RzM3WDSzvhm6gIz1yfTbBt6YTlcEKAvsmqCZZFw46z626lVj9j1yEPW33H5H+lBQpZMP1k8l+78Ha0A==}
    engines: {node: '>=8'}
    dependencies:
      fill-range: 7.0.1
    dev: false

  /browserslist@4.22.1:
    resolution: {integrity: sha512-FEVc202+2iuClEhZhrWy6ZiAcRLvNMyYcxZ8raemul1DYVOVdFsbqckWLdsixQZCpJlwe77Z3UTalE7jsjnKfQ==}
    engines: {node: ^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7}
    hasBin: true
    dependencies:
      caniuse-lite: 1.0.30001561
      electron-to-chromium: 1.4.580
      node-releases: 2.0.13
      update-browserslist-db: 1.0.13(browserslist@4.22.1)
    dev: true

  /camelize@1.0.1:
    resolution: {integrity: sha512-dU+Tx2fsypxTgtLoE36npi3UqcjSSMNYfkqgmoEhtZrraP5VWq0K7FkWVTYa8eMPtnU/G2txVsfdCJTn9uzpuQ==}
    dev: false

  /caniuse-lite@1.0.30001561:
    resolution: {integrity: sha512-NTt0DNoKe958Q0BE0j0c1V9jbUzhBxHIEJy7asmGrpE0yG63KTV7PLHPnK2E1O9RsQrQ081I3NLuXGS6zht3cw==}
    dev: true

  /chalk@2.4.2:
    resolution: {integrity: sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==}
    engines: {node: '>=4'}
    dependencies:
      ansi-styles: 3.2.1
      escape-string-regexp: 1.0.5
      supports-color: 5.5.0

  /chalk@4.1.2:
    resolution: {integrity: sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==}
    engines: {node: '>=10'}
    dependencies:
      ansi-styles: 4.3.0
      supports-color: 7.2.0
    dev: false

  /ci-info@3.9.0:
    resolution: {integrity: sha512-NIxF55hv4nSqQswkAeiOi1r83xy8JldOFDTWiug55KBu9Jnblncd2U6ViHmYgHf01TPZS77NJBhBMKdWj9HQMQ==}
    engines: {node: '>=8'}
    dev: false

  /color-convert@1.9.3:
    resolution: {integrity: sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==}
    dependencies:
      color-name: 1.1.3

  /color-convert@2.0.1:
    resolution: {integrity: sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==}
    engines: {node: '>=7.0.0'}
    dependencies:
      color-name: 1.1.4
    dev: false

  /color-name@1.1.3:
    resolution: {integrity: sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==}

  /color-name@1.1.4:
    resolution: {integrity: sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==}
    dev: false

  /concat-map@0.0.1:
    resolution: {integrity: sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==}
    dev: false

  /convert-source-map@2.0.0:
    resolution: {integrity: sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==}
    dev: true

  /cross-spawn@7.0.3:
    resolution: {integrity: sha512-iRDPJKUPVEND7dHPO8rkbOnPpyDygcDFtWjpeWNCgy8WP2rXcxXL8TskReQl6OrB2G7+UJrags1q15Fudc7G6w==}
    engines: {node: '>= 8'}
    dependencies:
      path-key: 3.1.1
      shebang-command: 2.0.0
      which: 2.0.2
    dev: false

  /css-color-keywords@1.0.0:
    resolution: {integrity: sha512-FyyrDHZKEjXDpNJYvVsV960FiqQyXc/LlYmsxl2BcdMb2WPx0OGRVgTg55rPSyLSNMqP52R9r8geSp7apN3Ofg==}
    engines: {node: '>=4'}
    dev: false

  /css-to-react-native@3.2.0:
    resolution: {integrity: sha512-e8RKaLXMOFii+02mOlqwjbD00KSEKqblnpO9e++1aXS1fPQOpS1YoqdVHBqPjHNoxeF2mimzVqawm2KCbEdtHQ==}
    dependencies:
      camelize: 1.0.1
      css-color-keywords: 1.0.0
      postcss-value-parser: 4.2.0
    dev: false

  /csstype@3.1.2:
    resolution: {integrity: sha512-I7K1Uu0MBPzaFKg4nI5Q7Vs2t+3gWWW648spaF+Rg7pI9ds18Ugn+lvg4SHczUdKlHI5LWBXyqfS8+DufyBsgQ==}
    dev: false

  /debug@4.3.4(supports-color@5.5.0):
    resolution: {integrity: sha512-PRWFHuSU3eDtQJPvnNY7Jcket1j0t5OuOsFzPPzsekD52Zl8qUfFIPEiswXqIvHWGVHOgX+7G/vCNNhehwxfkQ==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true
    dependencies:
      ms: 2.1.2
      supports-color: 5.5.0

  /electron-to-chromium@1.4.580:
    resolution: {integrity: sha512-T5q3pjQon853xxxHUq3ZP68ZpvJHuSMY2+BZaW3QzjS4HvNuvsMmZ/+lU+nCrftre1jFZ+OSlExynXWBihnXzw==}
    dev: true

  /esbuild@0.18.20:
    resolution: {integrity: sha512-ceqxoedUrcayh7Y7ZX6NdbbDzGROiyVBgC4PriJThBKSVPWnnFHZAkfI1lJT8QFkOwH4qOS2SJkS4wvpGl8BpA==}
    engines: {node: '>=12'}
    hasBin: true
    optionalDependencies:
      '@esbuild/android-arm': 0.18.20
      '@esbuild/android-arm64': 0.18.20
      '@esbuild/android-x64': 0.18.20
      '@esbuild/darwin-arm64': 0.18.20
      '@esbuild/darwin-x64': 0.18.20
      '@esbuild/freebsd-arm64': 0.18.20
      '@esbuild/freebsd-x64': 0.18.20
      '@esbuild/linux-arm': 0.18.20
      '@esbuild/linux-arm64': 0.18.20
      '@esbuild/linux-ia32': 0.18.20
      '@esbuild/linux-loong64': 0.18.20
      '@esbuild/linux-mips64el': 0.18.20
      '@esbuild/linux-ppc64': 0.18.20
      '@esbuild/linux-riscv64': 0.18.20
      '@esbuild/linux-s390x': 0.18.20
      '@esbuild/linux-x64': 0.18.20
      '@esbuild/netbsd-x64': 0.18.20
      '@esbuild/openbsd-x64': 0.18.20
      '@esbuild/sunos-x64': 0.18.20
      '@esbuild/win32-arm64': 0.18.20
      '@esbuild/win32-ia32': 0.18.20
      '@esbuild/win32-x64': 0.18.20
    dev: true

  /escalade@3.1.1:
    resolution: {integrity: sha512-k0er2gUkLf8O0zKJiAhmkTnJlTvINGv7ygDNPbeIsX/TJjGJZHuh9B2UxbsaEkmlEo9MfhrSzmhIlhRlI2GXnw==}
    engines: {node: '>=6'}
    dev: true

  /escape-string-regexp@1.0.5:
    resolution: {integrity: sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==}
    engines: {node: '>=0.8.0'}

  /fill-range@7.0.1:
    resolution: {integrity: sha512-qOo9F+dMUmC2Lcb4BbVvnKJxTPjCm+RRpe4gDuGrzkL7mEVl/djYSu2OdQ2Pa302N4oqkSg9ir6jaLWJ2USVpQ==}
    engines: {node: '>=8'}
    dependencies:
      to-regex-range: 5.0.1
    dev: false

  /find-yarn-workspace-root@2.0.0:
    resolution: {integrity: sha512-1IMnbjt4KzsQfnhnzNd8wUEgXZ44IzZaZmnLYx7D5FZlaHt2gW20Cri8Q+E/t5tIj4+epTBub+2Zxu/vNILzqQ==}
    dependencies:
      micromatch: 4.0.5
    dev: false

  /fs-extra@9.1.0:
    resolution: {integrity: sha512-hcg3ZmepS30/7BSFqRvoo3DOMQu7IjqxO5nCDt+zM9XWjb33Wg7ziNT+Qvqbuc3+gWpzO02JubVyk2G4Zvo1OQ==}
    engines: {node: '>=10'}
    dependencies:
      at-least-node: 1.0.0
      graceful-fs: 4.2.11
      jsonfile: 6.1.0
      universalify: 2.0.1
    dev: false

  /fs.realpath@1.0.0:
    resolution: {integrity: sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==}
    dev: false

  /fsevents@2.3.3:
    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
    os: [darwin]
    requiresBuild: true
    dev: true
    optional: true

  /gensync@1.0.0-beta.2:
    resolution: {integrity: sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==}
    engines: {node: '>=6.9.0'}
    dev: true

  /glob@7.2.3:
    resolution: {integrity: sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==}
    dependencies:
      fs.realpath: 1.0.0
      inflight: 1.0.6
      inherits: 2.0.4
      minimatch: 3.1.2
      once: 1.4.0
      path-is-absolute: 1.0.1
    dev: false

  /globals@11.12.0:
    resolution: {integrity: sha512-WOBp/EEGUiIsJSp7wcv/y6MO+lV9UoncWqxuFfm8eBwzWNgyfBd6Gz+IeKQ9jCmyhoH99g15M3T+QaVHFjizVA==}
    engines: {node: '>=4'}

  /graceful-fs@4.2.11:
    resolution: {integrity: sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==}
    dev: false

  /has-flag@3.0.0:
    resolution: {integrity: sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==}
    engines: {node: '>=4'}

  /has-flag@4.0.0:
    resolution: {integrity: sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==}
    engines: {node: '>=8'}
    dev: false

  /hoist-non-react-statics@3.3.2:
    resolution: {integrity: sha512-/gGivxi8JPKWNm/W0jSmzcMPpfpPLc3dY/6GxhX2hQ9iGj3aDfklV4ET7NjKpSinLpJ5vafa9iiGIEZg10SfBw==}
    dependencies:
      react-is: 16.13.1
    dev: false

  /inflight@1.0.6:
    resolution: {integrity: sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==}
    dependencies:
      once: 1.4.0
      wrappy: 1.0.2
    dev: false

  /inherits@2.0.4:
    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}
    dev: false

  /is-docker@2.2.1:
    resolution: {integrity: sha512-F+i2BKsFrH66iaUFc0woD8sLy8getkwTwtOBjvs56Cx4CgJDeKQeqfz8wAYiSb8JOprWhHH5p77PbmYCvvUuXQ==}
    engines: {node: '>=8'}
    hasBin: true
    dev: false

  /is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}
    engines: {node: '>=0.12.0'}
    dev: false

  /is-wsl@2.2.0:
    resolution: {integrity: sha512-fKzAra0rGJUUBwGBgNkHZuToZcn+TtXHpeCgmkMJMMYx1sQDYaCSyjJBSCa2nH1DGm7s3n1oBnohoVTBaN7Lww==}
    engines: {node: '>=8'}
    dependencies:
      is-docker: 2.2.1
    dev: false

  /isexe@2.0.0:
    resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}
    dev: false

  /js-tokens@4.0.0:
    resolution: {integrity: sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==}

  /jsesc@2.5.2:
    resolution: {integrity: sha512-OYu7XEzjkCQ3C5Ps3QIZsQfNpqoJyZZA99wd9aWd05NCtC5pWOkShK2mkL6HXQR6/Cy2lbNdPlZBpuQHXE63gA==}
    engines: {node: '>=4'}
    hasBin: true

  /json5@2.2.3:
    resolution: {integrity: sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==}
    engines: {node: '>=6'}
    hasBin: true
    dev: true

  /jsonfile@6.1.0:
    resolution: {integrity: sha512-5dgndWOriYSm5cnYaJNhalLNDKOqFwyDB/rr1E9ZsGciGvKPs8R2xYGCacuf3z6K1YKDz182fd+fY3cn3pMqXQ==}
    dependencies:
      universalify: 2.0.1
    optionalDependencies:
      graceful-fs: 4.2.11
    dev: false

  /klaw-sync@6.0.0:
    resolution: {integrity: sha512-nIeuVSzdCCs6TDPTqI8w1Yre34sSq7AkZ4B3sfOBbI2CgVSB4Du4aLQijFU2+lhAFCwt9+42Hel6lQNIv6AntQ==}
    dependencies:
      graceful-fs: 4.2.11
    dev: false

  /lodash@4.17.21:
    resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}
    dev: false

  /loose-envify@1.4.0:
    resolution: {integrity: sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==}
    hasBin: true
    dependencies:
      js-tokens: 4.0.0
    dev: false

  /lru-cache@5.1.1:
    resolution: {integrity: sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==}
    dependencies:
      yallist: 3.1.1
    dev: true

  /micromatch@4.0.5:
    resolution: {integrity: sha512-DMy+ERcEW2q8Z2Po+WNXuw3c5YaUSFjAO5GsJqfEl7UjvtIuFKO6ZrKvcItdy98dwFI2N1tg3zNIdKaQT+aNdA==}
    engines: {node: '>=8.6'}
    dependencies:
      braces: 3.0.2
      picomatch: 2.3.1
    dev: false

  /minimatch@3.1.2:
    resolution: {integrity: sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==}
    dependencies:
      brace-expansion: 1.1.11
    dev: false

  /minimist@1.2.8:
    resolution: {integrity: sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==}
    dev: false

  /ms@2.1.2:
    resolution: {integrity: sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==}

  /nanoid@3.3.7:
    resolution: {integrity: sha512-eSRppjcPIatRIMC1U6UngP8XFcz8MQWGQdt1MTBQ7NaAmvXDfvNxbvWV3x2y6CdEUciCSsDHDQZbhYaB8QEo2g==}
    engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}
    hasBin: true
    dev: true

  /node-releases@2.0.13:
    resolution: {integrity: sha512-uYr7J37ae/ORWdZeQ1xxMJe3NtdmqMC/JZK+geofDrkLUApKRHPd18/TxtBOJ4A0/+uUIliorNrfYV6s1b02eQ==}
    dev: true

  /once@1.4.0:
    resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}
    dependencies:
      wrappy: 1.0.2
    dev: false

  /open@7.4.2:
    resolution: {integrity: sha512-MVHddDVweXZF3awtlAS+6pgKLlm/JgxZ90+/NBurBoQctVOOB/zDdVjcyPzQ+0laDGbsWgrRkflI65sQeOgT9Q==}
    engines: {node: '>=8'}
    dependencies:
      is-docker: 2.2.1
      is-wsl: 2.2.0
    dev: false

  /os-tmpdir@1.0.2:
    resolution: {integrity: sha512-D2FR03Vir7FIu45XBY20mTb+/ZSWB00sjU9jdQXt83gDrI4Ztz5Fs7/yy74g2N5SVQY4xY1qDr4rNddwYRVX0g==}
    engines: {node: '>=0.10.0'}
    dev: false

  /patch-package@7.0.0:
    resolution: {integrity: sha512-eYunHbnnB2ghjTNc5iL1Uo7TsGMuXk0vibX3RFcE/CdVdXzmdbMsG/4K4IgoSuIkLTI5oHrMQk4+NkFqSed0BQ==}
    engines: {node: '>=14', npm: '>5'}
    hasBin: true
    dependencies:
      '@yarnpkg/lockfile': 1.1.0
      chalk: 4.1.2
      ci-info: 3.9.0
      cross-spawn: 7.0.3
      find-yarn-workspace-root: 2.0.0
      fs-extra: 9.1.0
      klaw-sync: 6.0.0
      minimist: 1.2.8
      open: 7.4.2
      rimraf: 2.7.1
      semver: 5.7.2
      slash: 2.0.0
      tmp: 0.0.33
      yaml: 2.3.4
    dev: false

  /path-is-absolute@1.0.1:
    resolution: {integrity: sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==}
    engines: {node: '>=0.10.0'}
    dev: false

  /path-key@3.1.1:
    resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}
    engines: {node: '>=8'}
    dev: false

  /picocolors@1.0.0:
    resolution: {integrity: sha512-1fygroTLlHu66zi26VoTDv8yRgm0Fccecssto+MhsZ0D/DGW2sm8E8AjW7NU5VVTRt5GxbeZ5qBuJr+HyLYkjQ==}
    dev: true

  /picomatch@2.3.1:
    resolution: {integrity: sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==}
    engines: {node: '>=8.6'}
    dev: false

  /postcss-value-parser@4.2.0:
    resolution: {integrity: sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==}
    dev: false

  /postcss@8.4.31:
    resolution: {integrity: sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==}
    engines: {node: ^10 || ^12 || >=14}
    dependencies:
      nanoid: 3.3.7
      picocolors: 1.0.0
      source-map-js: 1.0.2
    dev: true

  /react-dom@18.2.0(react@18.2.0):
    resolution: {integrity: sha512-6IMTriUmvsjHUjNtEDudZfuDQUoWXVxKHhlEGSk81n4YFS+r/Kl99wXiwlVXtPBtJenozv2P+hxDsw9eA7Xo6g==}
    peerDependencies:
      react: ^18.2.0
    dependencies:
      loose-envify: 1.4.0
      react: 18.2.0
      scheduler: 0.23.0
    dev: false

  /react-is@16.13.1:
    resolution: {integrity: sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==}
    dev: false

  /react-native-pager-view@6.2.1(react@18.2.0):
    resolution: {integrity: sha512-fZ8chez5J+w831nSnbtK8hwlCiMy1DgpFv8xG6ajXLsAI8uMkGvP554QDIDNlUoCuVwMf7OFyd32Y2Nm2Iaj9Q==}
    peerDependencies:
      react: '*'
      react-native: '*'
    dependencies:
      react: 18.2.0
    dev: false

  /react-native-tab-view@3.5.2(react-native-pager-view@6.2.1)(react@18.2.0):
    resolution: {integrity: sha512-nE5WqjbeEPsWQx4mtz81QGVvgHRhujTNIIZiMCx3Bj6CBFDafbk7XZp9ocmtzXUQaZ4bhtVS43R4FIiR4LboJw==}
    peerDependencies:
      react: '*'
      react-native: '*'
      react-native-pager-view: '*'
    dependencies:
      react: 18.2.0
      react-native-pager-view: 6.2.1(react@18.2.0)
      use-latest-callback: 0.1.9(react@18.2.0)
    dev: false

  /react-refresh@0.14.0:
    resolution: {integrity: sha512-wViHqhAd8OHeLS/IRMJjTSDHF3U9eWi62F/MledQGPdJGDhodXJ9PBLNGr6WWL7qlH12Mt3TyTpbS+hGXMjCzQ==}
    engines: {node: '>=0.10.0'}
    dev: true

  /react@18.2.0:
    resolution: {integrity: sha512-/3IjMdb2L9QbBdWiW5e3P2/npwMBaU9mHCSCUzNln0ZCYbcfTsGbTJrU/kGemdH2IWmB2ioZ+zkxtmq6g09fGQ==}
    engines: {node: '>=0.10.0'}
    dependencies:
      loose-envify: 1.4.0
    dev: false

  /regenerator-runtime@0.13.11:
    resolution: {integrity: sha512-kY1AZVr2Ra+t+piVaJ4gxaFaReZVH40AKNo7UCX6W+dEwBo/2oZJzqfuN1qLq1oL45o56cPaTXELwrTh8Fpggg==}
    dev: false

  /rimraf@2.7.1:
    resolution: {integrity: sha512-uWjbaKIK3T1OSVptzX7Nl6PvQ3qAGtKEtVRjRuazjfL3Bx5eI409VZSqgND+4UNnmzLVdPj9FqFJNPqBZFve4w==}
    hasBin: true
    dependencies:
      glob: 7.2.3
    dev: false

  /rollup@3.29.4:
    resolution: {integrity: sha512-oWzmBZwvYrU0iJHtDmhsm662rC15FRXmcjCk1xD771dFDx5jJ02ufAQQTn0etB2emNk4J9EZg/yWKpsn9BWGRw==}
    engines: {node: '>=14.18.0', npm: '>=8.0.0'}
    hasBin: true
    optionalDependencies:
      fsevents: 2.3.3
    dev: true

  /scheduler@0.23.0:
    resolution: {integrity: sha512-CtuThmgHNg7zIZWAXi3AsyIzA3n4xx7aNyjwC2VJldO2LMVDhFK+63xGqq6CsJH4rTAt6/M+N4GhZiDYPx9eUw==}
    dependencies:
      loose-envify: 1.4.0
    dev: false

  /semver@5.7.2:
    resolution: {integrity: sha512-cBznnQ9KjJqU67B52RMC65CMarK2600WFnbkcaiwWq3xy/5haFJlshgnpjovMVJ+Hff49d8GEn0b87C5pDQ10g==}
    hasBin: true
    dev: false

  /semver@6.3.1:
    resolution: {integrity: sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==}
    hasBin: true
    dev: true

  /shallowequal@1.1.0:
    resolution: {integrity: sha512-y0m1JoUZSlPAjXVtPPW70aZWfIL/dSP7AFkRnniLCrK/8MDKog3TySTBmckD+RObVxH0v4Tox67+F14PdED2oQ==}
    dev: false

  /shebang-command@2.0.0:
    resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}
    engines: {node: '>=8'}
    dependencies:
      shebang-regex: 3.0.0
    dev: false

  /shebang-regex@3.0.0:
    resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}
    engines: {node: '>=8'}
    dev: false

  /slash@2.0.0:
    resolution: {integrity: sha512-ZYKh3Wh2z1PpEXWr0MpSBZ0V6mZHAQfYevttO11c51CaWjGTaadiKZ+wVt1PbMlDV5qhMFslpZCemhwOK7C89A==}
    engines: {node: '>=6'}
    dev: false

  /source-map-js@1.0.2:
    resolution: {integrity: sha512-R0XvVJ9WusLiqTCEiGCmICCMplcCkIwwR11mOSD9CR5u+IXYdiseeEuXCVAjS54zqwkLcPNnmU4OeJ6tUrWhDw==}
    engines: {node: '>=0.10.0'}
    dev: true

  /styled-components@5.3.11(react-dom@18.2.0)(react@18.2.0):
    resolution: {integrity: sha512-uuzIIfnVkagcVHv9nE0VPlHPSCmXIUGKfJ42LNjxCCTDTL5sgnJ8Z7GZBq0EnLYGln77tPpEpExt2+qa+cZqSw==}
    engines: {node: '>=10'}
    peerDependencies:
      react: '>= 16.8.0'
      react-dom: '>= 16.8.0'
      react-is: '>= 16.8.0'
    dependencies:
      '@babel/helper-module-imports': 7.22.15
      '@babel/traverse': 7.23.3(supports-color@5.5.0)
      '@emotion/is-prop-valid': 1.2.1
      '@emotion/stylis': 0.8.5
      '@emotion/unitless': 0.7.5
      babel-plugin-styled-components: 2.1.4(styled-components@5.3.11)
      css-to-react-native: 3.2.0
      hoist-non-react-statics: 3.3.2
      react: 18.2.0
      react-dom: 18.2.0(react@18.2.0)
      shallowequal: 1.1.0
      supports-color: 5.5.0
    transitivePeerDependencies:
      - '@babel/core'
    dev: false

  /supports-color@5.5.0:
    resolution: {integrity: sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==}
    engines: {node: '>=4'}
    dependencies:
      has-flag: 3.0.0

  /supports-color@7.2.0:
    resolution: {integrity: sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==}
    engines: {node: '>=8'}
    dependencies:
      has-flag: 4.0.0
    dev: false

  /tabbable@6.2.0:
    resolution: {integrity: sha512-Cat63mxsVJlzYvN51JmVXIgNoUokrIaT2zLclCXjRd8boZ0004U4KCs/sToJ75C6sdlByWxpYnb5Boif1VSFew==}
    dev: false

  /tinycolor2@1.6.0:
    resolution: {integrity: sha512-XPaBkWQJdsf3pLKJV9p4qN/S+fm2Oj8AIPo1BTUhg5oxkvm9+SVEGFdhyOz7tTdUTfvxMiAs4sp6/eZO2Ew+pw==}
    dev: false

  /tmp@0.0.33:
    resolution: {integrity: sha512-jRCJlojKnZ3addtTOjdIqoRuPEKBvNXcGYqzO6zWZX8KfKEpnGY5jfggJQ3EjKuu8D4bJRr0y+cYJFmYbImXGw==}
    engines: {node: '>=0.6.0'}
    dependencies:
      os-tmpdir: 1.0.2
    dev: false

  /to-fast-properties@2.0.0:
    resolution: {integrity: sha512-/OaKK0xYrs3DmxRYqL/yDc+FxFUVYhDlXMhRmv3z915w2HF1tnN1omB354j8VUGO/hbRzyD6Y3sA7v7GS/ceog==}
    engines: {node: '>=4'}

  /to-regex-range@5.0.1:
    resolution: {integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==}
    engines: {node: '>=8.0'}
    dependencies:
      is-number: 7.0.0
    dev: false

  /tslib@2.6.2:
    resolution: {integrity: sha512-AEYxH93jGFPn/a2iVAwW87VuUIkR1FVUKB77NwMF7nBTDkDrrT/Hpt/IrCJ0QXhW27jTBDcf5ZY7w6RiqTMw2Q==}
    dev: false

  /universalify@2.0.1:
    resolution: {integrity: sha512-gptHNQghINnc/vTGIk0SOFGFNXw7JVrlRUtConJRlvaw6DuX0wO5Jeko9sWrMBhh+PsYAZ7oXAiOnf/UKogyiw==}
    engines: {node: '>= 10.0.0'}
    dev: false

  /update-browserslist-db@1.0.13(browserslist@4.22.1):
    resolution: {integrity: sha512-xebP81SNcPuNpPP3uzeW1NYXxI3rxyJzF3pD6sH4jE7o/IX+WtSpwnVU+qIsDPyk0d3hmFQ7mjqc6AtV604hbg==}
    hasBin: true
    peerDependencies:
      browserslist: '>= 4.21.0'
    dependencies:
      browserslist: 4.22.1
      escalade: 3.1.1
      picocolors: 1.0.0
    dev: true

  /use-latest-callback@0.1.9(react@18.2.0):
    resolution: {integrity: sha512-CL/29uS74AwreI/f2oz2hLTW7ZqVeV5+gxFeGudzQrgkCytrHw33G4KbnQOrRlAEzzAFXi7dDLMC9zhWcVpzmw==}
    peerDependencies:
      react: '>=16.8'
    dependencies:
      react: 18.2.0
    dev: false

  /use-presence@1.1.0(react-dom@18.2.0)(react@18.2.0):
    resolution: {integrity: sha512-Tol+g7q81LLjhFMvrzhKXa4CCyZ0Tg4MRcPC2eSqdDLGQEA1MnjNc/jMFDKSB8CZDFchd7FOsq33glZyFX3zuw==}
    peerDependencies:
      react: ^16.8.0 || ^17.0.0 || ^18.0.0
      react-dom: ^16.8.0 || ^17.0.0 || ^18.0.0
    dependencies:
      react: 18.2.0
      react-dom: 18.2.0(react@18.2.0)
      tslib: 2.6.2
    dev: false

  /vite@4.5.0:
    resolution: {integrity: sha512-ulr8rNLA6rkyFAlVWw2q5YJ91v098AFQ2R0PRFwPzREXOUJQPtFUG0t+/ZikhaOCDqFoDhN6/v8Sq0o4araFAw==}
    engines: {node: ^14.18.0 || >=16.0.0}
    hasBin: true
    peerDependencies:
      '@types/node': '>= 14'
      less: '*'
      lightningcss: ^1.21.0
      sass: '*'
      stylus: '*'
      sugarss: '*'
      terser: ^5.4.0
    peerDependenciesMeta:
      '@types/node':
        optional: true
      less:
        optional: true
      lightningcss:
        optional: true
      sass:
        optional: true
      stylus:
        optional: true
      sugarss:
        optional: true
      terser:
        optional: true
    dependencies:
      esbuild: 0.18.20
      postcss: 8.4.31
      rollup: 3.29.4
    optionalDependencies:
      fsevents: 2.3.3
    dev: true

  /which@2.0.2:
    resolution: {integrity: sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==}
    engines: {node: '>= 8'}
    hasBin: true
    dependencies:
      isexe: 2.0.0
    dev: false

  /wrappy@1.0.2:
    resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}
    dev: false

  /yallist@3.1.1:
    resolution: {integrity: sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==}
    dev: true

  /yaml@2.3.4:
    resolution: {integrity: sha512-8aAvwVUSHpfEqTQ4w/KMlf3HcRdt50E5ODIQJBw1fQ5RL34xabzxtUlzTXVqc4rkZsPbvrXKWnABCD7kWSmocA==}
    engines: {node: '>= 14'}
    dev: false

`;

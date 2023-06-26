/**
 * TODO
 * [x] count if the components are blade/local components
 * [x] tiny ui to display the information
 * [x] Bug with the component ids changing from file to file
 * [x] consider the top level nodes as root only if they are frame nodes else ignore
 * [x] change the colors of coverage based on the %
 * [] count text nodes to be blade if they use styles from blade because they don't use typo component
 * [] highlight the non blade nodes
 * [] show plugin ui config
 *    - what position to show the coverage report
 *    - highlight the non blade nodes?
 *    - highlight the local components?
 *    - highlight non blade styles?
 * --release v1--
 * [] count blade vs non blade styles
 * [] highlight non blade styles
 *
 */
import {
  getParentNode,
  traverseNode,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities';

const paymentLightComponents = {
  // Components
  '03fa4ffc23c92fdf4b0afa2b3d4977d8e0d01323': 'BottomSheet/Header',
  '042e23e06d6b21818f6ecfa2ef75f8112a5a4d32': 'Modal',
  '1568049d40a5c7465dbf686d6e9d5892ec4b69d2': 'Dropdown/Footer',
  '18c8adc53a8c9c098e19259036c5ddec47debda4': 'Bottom Sheet',
  '1e18a66e07ce9830b6a4e440a9b7c02ae55d069b': 'ActionListItems Group',
  '1fbef7453e9ef0338195174488daf0eb12af547b': 'TextArea Input',
  '2606f144eec11f07d05262363772e905626132f7': 'Indicators',
  '301e099f941f2b4a4c1475779e72659d7caabd4d': 'Dropdown Menu',
  '32fe4cbbe78df114379f99b331eb210b8f481a68': 'Spacer',
  '3907e42380851a0648ed6d34aba02f9d540d053d': 'Alert',
  '3942574367676524ab7ea045ece704f751984dae': 'Divider',
  '3a215359b6cbc947ed0da9d615147e5df1b165d6': 'Modal/Footer',
  '3e815961f46f78feeff6ae13847a6740028d17f8': 'Skeleton Block',
  '3fecf97b5a2e238c23a4791cc22990f6ffba3416': 'Modal/Header',
  '49cd227b1c67f7c13d432eadd4adbd59d2c93572': 'List',
  '4e64f322c247894978e7056349d624da9521cf8f': 'BottomSheet/Footer',
  '5acfcd1de0ee3569014590cdede3bd11b5f4b143': 'Dropdown/Header',
  '5c9e5713c2fc6f717b11d0d824ec7505c55d5251': 'ActionListItem/selectionType-Multi Select',
  '61339dd51608d6de7b898abc2aa2ff7bb1b58cf3': 'Text',
  '67cb235833f1326ec27c51540ecc24566f986263': 'Checkbox',
  '765dfe31bdb5842b83cb32756aa39205a2d85114': 'Password Input',
  '856b8daacf67b0dda92fca150324a1ceb888cc0f': 'Title',
  '8f7acd11dfa05673822adbeb67ab0672e7f7f07f': 'Spinner',
  '927781eb654ae1e4cdcb0cb79d5840797a7fb8db': 'Switch',
  a49a552a588ecab96554fd77b0c26810e5341cb7: 'OTP Input',
  a57c8eca46440b6aa34b51d1d177c6921c1bcea8: 'Radio-Group',
  a8afab83a4a784647d6c7df136e365d7681e712e: 'Text Input',
  acf3eb63bacc1f1ed3d20adda0987e5b79e3b39c: 'Select Input',
  b1e9234a4e6a6fb424bf6cfa12b78c26b64f8d7a: 'Link',
  b89d299d42a6118a2f6e225ca6b2bc89ee3b7c0a: 'Radio-Button',
  bec7d287193c3745a8319e83430ba77807c931fa: 'Checkbox-Group',
  c91a7dfbe196427235d83d1f2d0616cf9d68adb0: 'Heading',
  c9610928e78b65bf7eba1ffbdae7949752768d50: 'ProgressBar',
  caaa65e58c8a824e0f29bf5292fe1cb0538de979: 'Code',
  cf9acdee32e864eb029037c36a8188ca3bef5c99: 'Amount',
  d285cf127fe40b524f3906031f42278c9c73253f: 'ActionListItem/selectionType-Default Negative',
  d30fd61864bce5c16aa8c313b583a1c46d8ada73: 'ActionListItem/selectionType-Default',
  d7db0adc428e86e680c04e46d2d01d87a082a15c: 'ActionListItem/selectionType-Single Select',
  da16ecb1aaad66d8e93a96a8f01ed231f623f1f9: 'IconButton',
  e09ad81797dc0731ea5ac7f3a23fd084a42327a7: 'Card',
  e6fac352ee79b6e97e2a15c221ec2ca325e20cb3: 'Bottomsheet Head - Grab handle container',
  ebcbd4a499165aba97710a7f06e169992411af93: 'Badge',
  f3e4922ddea0657c23d62298b9ebff068386688f: 'Counter',
  fadfca88c14a46b3ae08ede9b1ac1dab7199ab36: 'Button',
  // Icons
  '00b40d9bd58d0f51d4254a57afd09b375bc84b40': 'trash',
  '00e8748d94e367056af2dc30ebd5d1b1e43b90bf': 'facebook',
  '01ff18c072b30be59fc11700aaea35f0358bcab1': 'anchor',
  '0236269d5f148ad171fa3dc722ca9fbd87180e24': 'tag',
  '023a2bee8e348fe53d8e370e480945863e6dedc7': 'speaker',
  '032bafa0be8a028637f9c028e9eb2202b1aebe0e': 'clipboard',
  '0588c2c8d7f82651f8b0ef7f1aa1543e7a6248a5': 'package',
  '05a501200825883daf4f2c9fdcf137be3709e17f': 'shopping-cart',
  '05f637667344bf96d83d94ca5c7c9fd91a214b2b': 'sun',
  '064683db4a59d346c1ffcf883e573593e18b0774': 'stamp',
  '079256cd4a2f12d710e64e03f3b22ddd96fae4af': 'voicemail',
  '083a8e38070ba436b8ab7ea14750b1da2256eefb': 'percent',
  '0853286923a4003a906e265b9fdb75094598d8b3': 'radio',
  '088afad4bcb66ebc9089452237a5a8006542f420': 'arrow-up-left',
  '08cf65a99610d252b7f41c91db60d1247cdb8045': 'smartphone',
  '091c6fe3245f7a33d45985293cf2f4c6ca009a13': 'external-link',
  '096c1ef8499023ac24c135fc8bb5f6f78aa85aac': 'slash',
  '0a005f7f102b5eda0e39fe85c046b4265d978a1a': 'full-screen-enter',
  '0b0bbdf975501de8343503a9209fea73c97eeec8': 'feather',
  '0b8e869af2ab8c1765c7aece87d2f4e9a6db556f': 'award',
  '0e3c37d07f1f4c88b14fab6182aadacc23a8504c': 'printer',
  '0ea963fa52d77060710bf26cd9b4dd6ae4c6237f': 'rotate-ccw',
  '0fb6968a8c0e22f83c1306bc34cd5cc2eaa16cfc': 'alert-triangle',
  '108cf03bb92bb9dd9f5eefb5e8bcb28708749eb2': 'plus-square',
  '109b670d4e67ac7a550b0e62b329bc22426ccb3e': 'thumbs-down',
  '12838816c79114c3ad1dcc180773399b79fbc4a3': 'tablet',
  '1482f54300c435b904cda873814c9a083bf1949e': 'payment-pages',
  '14ec8eb4da912af03cfee3e3d9b7213e3efe86cb': 'rotate-cw',
  '152a95ed1eeb72b55037c262c19c09523f712168': 'corner-right-down',
  '166c328f0a22fb4d4c71b617e7e019b262f22890': 'bookmark',
  '17563cfdcf9608e0d699d1d82aa5a7ff1ad4304b': 'shuffle',
  '18c4da9f2c429515845ee0faeedece25384f6272': 'share',
  '18f2423502934530fcfd3cfc08415d1749062be8': 'star',
  '1a2b2c7f5a8f37b3e30cb9d1a4edd8e8def71da8': 'user-minus',
  '1b88d5e28a92bc6534200d0991ec2fb475c91c8a': 'folder',
  '1ba3f39626558eb09c8c845286b57e013e1c507b': 'save',
  '1c0f0cd309d9839f6b671f274f3275c8bc10ba37': 'link',
  '1d2b40b7df4f10db9a85f26cfaa36ae0a40782bd': 'layout',
  '1e51f085a76a6261d60cade873c4dd24c8bb54cc': 'cloud-snow',
  '1ef94703f873e0d13a9761676bd07b4b77e58767': 'edit-compose',
  '20233ce57794b1dd7d97c22b26a928679b98f279': 'image',
  '210e80280f545a7386417b47e4ad7cd89e06a662': 'refresh',
  '217c29702076a7d99c90a7bd46dcd37cee43138b': 'corner-right-up',
  '21ae87284a377483e57da248ae5e735e4987ca42': 'pie-chart',
  '21cb519d8a7b3ea3c40f11e8c5828dfbe2085d9c': 'thermometer',
  '2328b388b785415aad76097a48155a68e34fc940': 'battery',
  '23503397aa0ae195d975c7373d44efba62e19493': 'offers',
  '239b19e111a0828a67bc783dd97fefd9d30480cf': 'maximize',
  '23bbf7ffd8c11f55b53cea0a0ffaeb2c1ad3b482': 'more-horizontal',
  '24aa448f6a67d9a49b5e55658b539ce89b842bc1': 'repeat',
  '255b87f64b737876e6318960fcba909b02f7cb95': 'dashboard',
  '26b83440561071cc070c654e6adf95d6c70593ec': 'layers',
  '28d5ae52cd594eff27ca609b7b2c797a1cc26174': 'alert-octagon',
  '28d90e57d36eb65163bd6714caea93aa281e45af': 'activity',
  '28f7fd190f2381f865c6f8e1011cfaa6a9d5436d': 'paperclip',
  '2a033340ae9f5364bd2fac854e3383fa6f82ce9c': 'camera-off',
  '2b08e83bb5494ab2d2c5089f990f7acdcd587b4f': 'sunrise',
  '2d496c6ecbd479c9092e753d443ee848ea4f918f': 'more-vertical',
  '2e2c68457f41cc75e5e71c9cfd36ad375d4acc30': 'link',
  '2f7a73f24761df2bd9b6cc1e011908d1d3938fc4': 'qr-code',
  '30708d54ce110d71b39c7a2452282f5c096f624d': 'info',
  '30ab602c231ff763e77ca1339ec8d489fc4532d7': 'razorpayx',
  '30fbe3f941abdc75a9bbae0dc822d78964360b5e': 'align-left',
  '31c8b8a5e27995fbbb26beb264b3f0900ec498b2': 'coins',
  '3201604a6f4f2dde58ef910317edad4149a6eba3': 'box',
  '32759e2dedebe04db4fed648db2ffa666af854a2': 'circle',
  '331fc751308a2f263b2c07b68eacd72aa5bd35e3': 'github',
  '335197d2af04ae98d20b48634801ff9ca72b1683': 'chrome',
  '3525edc500c9d9c895eaa0acb3cc56b1b41e1276': 'alert-only',
  '35264f542abdf4596d45f63a76dcbd2c54fa5558': 'corner-left-up',
  '36f056a30cf0ab0773be5782641c4ea02721f57f': 'close',
  '375a9bf62b3db178f05e4f68bf2ef84d0da2534b': 'settings',
  '379c2c8429633164a969a7afb041dea351885ed5': 'razorpay',
  '37f148d37d84e0733b16a135858ba49ebcc9164b': 'user-x',
  '3896db76afb1b5530a00beb448924ce9c2edd668': 'wifi',
  '38ab8b084a1e3a471f1c20254f3ba08842c97921': 'play',
  '38e26453d951e5c21ca48d5d8b87af2434c182fd': 'at-sign',
  '3a42be40606bbf4582a8d5d0365c60856ab9823c': 'type',
  '3afd79d691121bc85767e1f1b80e694852607111': 'corner-up-left',
  '3c8f68aba4bea283d39ae44d0c99ebd23da4bbce': 'folder',
  '3caff79e38ba903ad47b34f42f6be6ee18cc9b84': 'users',
  '3cd15f84b0439e697b8f023d2c3202e5556e2eb9': 'skip-back',
  '3d9a2d6981a3e3ca96fb9a355645a059b09766d1': 'shuffle',
  '3dd0e7a32aa6687241817c6e76c3198c9cfabd14': 'pause',
  '4032d9f4ae3638943fca92d0fa7c272cd1e5b963': 'grid',
  '40f459ef3a62f95aa938caa7ae88fab212f7fbf8': 'watch',
  '42378cccea0ffdc086c65076ebb7b23b6663dd51': 'navigation',
  '42ad3ad5f1e5f69682730238351cd1334ebba599': 'cloud-drizzle',
  '42f3e4c5f9b954ee18f09d6e8ecfa830cea8f2ec': 'plus',
  '435c418ee1f951d65c53ae8e84ca7eabc314a82e': 'copy',
  '47fc96a146ea98ff54c46586178a267e885b8c1c': 'mic-off',
  '4840e197ad44ab0f102c4edb02a90d2b1fb062cf': 'trending-down',
  '48d379d1426e1dce868235a6d4128569f18c078d': 'loader',
  '48fb971917c1f4dbfc8aaf73d3942700b164575e': 'umbrella',
  '49b6a7b21c8313c96113ee5b87e48f2ac22a34ef': 'user-plus',
  '4b73b16888de986ce166661cbfc43f0d88e8c3cf': 'inbox',
  '4d3ecaad58c7faa0c4468138a2dcdbe4d938754b': 'rupees',
  '4e9a6b7fe631c307b614e2eeb4ccf1e1a2c962ea': 'bill',
  '4f5aacdd727e4250122f082830e78966c4208ead': 'book',
  '502a67c4c29174dd261aa1f612ac9276bbd20669': 'map',
  '50455509344c3dcaf8abdbead74c50a35e5470c2': 'inbox',
  '5084a50c108ab0eae400d86542dc5bd5502d4471': 'chevrons-right',
  '51ac938dd4fb6afc436383f0d071aa303f1838ae': 'crop',
  '526d28fecc42fb3b615e7e92911795c2e9343096': 'pause',
  '52747a689328c5d0d50be78a26f426d45b641f44': 'trending-down',
  '52b3999dc41e84625f8e13114ab327fe80536182': 'full-screen-exit',
  '5461b259adce1642f95e4ac70486f11b2adedbec': 'wind',
  '55caf52f8fc7df4fa0c3f27c4b7a112b742a56aa': 'smart-collect',
  '5724dd3403bf54f8ed3e5634f9ad3c36be77ecc9': 'file-plus',
  '58bc33f55135ddf287851272aeeebdf84fd3108e': 'save',
  '58fdaf3a23fa21cdb1b04d2cf52ec7cfc364e42b': 'video',
  '5911749f7a79bbf7f5461eca4f10c9ee70f58011': 'volume-low',
  '59da881a760443b36431db2a37f5e3e07a9ecef6': 'music',
  '5a19e4c59f5ef3f2205319a829d67f7883a780cb': 'minimize',
  '5b02e6094d70a745bc45cc7dee0ce051ce4bec88': 'chevron-right',
  '5bf920dd95768d45b860a644b213b3107834cbb0': 'mail',
  '5d6eb07c920dd50e95827b573b8275e66bcce133': 'move',
  '5ec42e0138a1b80a29d857cfaa336ad2bf3774aa': 'flag',
  '5fba66b4be7b4dec3d1b2a030c8329c54485ec38': 'video',
  '5fe07d7afbb94e7bfbed16ca64ddab04acb56300': 'file-text',
  '602bcb02bb38d4b1f02c05a18c719914eae393a0': 'square',
  '638712828f88cc106fa0726a0d26d5b204a21919': 'customers',
  '63f3fb231a32d5ac6e0633ddec62ae4c2ec86d9b': 'pause-circle',
  '641cdad8b8dcb7b4ce1212ac526d0c6a02deed1c': 'scissors',
  '64eaf29117a1f05b6791efa908e57c9e494a1267': 'search',
  '664b37a76b2633e70a6d1eb1341c77a8a525e73c': 'bar-chart',
  '6768ace0042b78f8ca8aec9a9d72adf26022de5d': 'cpu',
  '67b70976ab36bd703469e19aa3a43fe7bd27bd5d': 'corner-down-right',
  '67bf9af174c8650027431b0c77625907b2097de9': 'payment-buttons',
  '68a941ceed6b1f00573061bef807200a06584676': 'ticket',
  '68da6e55fb530a62c498505bb6c393eb10369a0e': 'clipboard',
  '6965e6bf4858508069065709faa3ca136dffddfe': 'zoom-out',
  '6984d04cdb40a1c496e9cb0cc0ba5aa85da6b2ea': 'chevrons-up',
  '6a6a5d69ef0547d2a3d4c3503811e8fad84eb44f': 'cloud-off',
  '6a790df39ac3760db26b4d85b552fae5189738eb': 'gitlab',
  '6b05ae208ab880f62d1a920dd3c46b2625b42d3e': 'mail-open',
  '6b2e5c0f9e81e60badef5d7bffa33975311ff9ec': 'full-screen-exit',
  '6b879da0fd360df1c8b203ed8eaeafa06cbcf03f': 'bar-chart-alt',
  '6c85b1fd693f11ede04db09bda537bec56b402b8': 'crosshair',
  '6d2c86e36926df5e2494058162eaec6bd0ff36b5': 'chevron-up',
  '6d7872efbc9232bceadc737adec2f75d4bce35a3': 'check-square',
  '6eab919807191ed70a35bb8c08ac4377e64f3b47': 'compass',
  '6fbfa8cf168e3ada128f44a50e29b725df51b0e9': 'server',
  '6ff403f9ca36e145e611b1b20d764158cf824896': 'arrow-down-left',
  '70fefae08c1c2976d42adb6d4858b3d8921f70bb': 'log-out',
  '7152b2bec549b88580a9e616e3b450ce2e14340e': 'subscriptions',
  '730877d9517965b494d4d0d91b2354fe1787e085': 'settlements',
  '73a0c0d2bf0634d846e99e2f221de444e640f374': 'clock',
  '7468614348b2b0e3d51d955aa484742a40fd9030': 'minus-square',
  '759c1990c6a4394af9a828fae4ef52c3df32f957': 'x-circle',
  '75a8d2f645c34ee967666379a2d0903c43aa19bc': 'check',
  '7609a84d37b772543ef52e2f4d30c8d2ab720e5b': 'slack',
  '764fffa81c04cd7ea92857b251bdddf5d8430f88': 'monitor',
  '76c08c8860c9068c54efc70cdf5c1e10036fd3db': 'underline',
  '76f37c8686425ca98c7b1e614f03466a92bdc415': 'unlock',
  '773b3fdc28217ba3555e3fa598c9f275fe078d71': 'edit',
  '7847fbf07e5101b7180af6b63fea8b1aab92661c': 'dot',
  '7a3ba49ae3716b103c5df452328721500f0c2eb3': 'corner-down-left',
  '7ba0dac95d323d7a196000015c6ce913b81d8143': 'bank',
  '7c8f9baf71188ec830e488eae2428acbc1a3ca7a': 'attachment',
  '7d2235181acfe7e60cba6d88147b1ac7599995ff': 'file',
  '7eac0cc349e70520dd55d96870db4f219196c954': 'log-in',
  '7fb401a3963d2c5309613011916292c77f002dfc': 'pause-circle',
  '8061f824f046638de4ecaad34b9f97c28c1d2d97': 'filter',
  '80af6fe7e1ace4591dd1c17ae0ef17a22e4d4106': 'transactions',
  '81c51dbd032c22a91ed70269fc8a093b606118ce': 'file-minus',
  '831ea6502636806411bf5cfc927adba256b3d825': 'corner-left-down',
  '84a8a7eda2f8c278b2769b170bff147c049868d1': 'repeat',
  '853e13332f0c6e4bb9cad5135a1c4b93adc68c76': 'menu-dots',
  '8685a0bda4e087c707234083f95579b8fc9bfa95': 'toggle-right',
  '8694c531690fc6b9a508b93281213ce111e5365b': 'phone-call',
  '8b0db1aed3617943c83b6ed51c23a6e2b5e72ac0': 'battery-charging',
  '8b1c6cfcc88ce0348c72cde54c83713c69705b8f': 'sliders',
  '8b3a6deed5583fd64183f3109dae65ac5eb306c6': 'film',
  '8b42d505b2541223c086895d8de9f4651e9f4616': 'thumbs-up',
  '8b7c36b57b913c8538f3c2622d4e9441d6052408': 'arrow-down',
  '8ba6131b6d26e1ac3608ee42bc7e82eeeaa738cc': 'routes',
  '8eb0602a59be1740f9c1f3b1eb11eb29237693f3': 'phone-incoming',
  '9057cb17348609a77d31a6040d5b44a9ddd6f458': 'full-screen-enter',
  '927c8cd69bb02767a457b38143e7fa615be17938': 'cloud',
  '938574fa23373c6a9a9a75eb19c2224ad40ff238': 'Dashboard / Sidebar',
  '939d76d52579880e2f89f14e9c24f8389a78f08f': 'bluetooth',
  '948643266857efa6a1ad7c91cf4c59330585b124': 'user-check',
  '94c9ea44c7b498f26698f1c973e804fe38402f35': 'map-pin',
  '95296d2a1f215a76170237c1d6edfbb04d4a9efd': 'octagon',
  '9538daefc097d2c0a6cae9cf5dc3a7fad4c0b246': 'delete',
  '95ab7f12a56584119b421d25465512e26e18d225': 'file-plus',
  '95d263abc7175b89a6c95501c08880cb744db188': 'sunset',
  '96476ed144eee43f190805204ee67241727f41ae': 'maximize',
  '96ce43a5334c6bb8975136f45dbb04ea2aa5bf57': 'phone-missed',
  '97a0d761ab5a80c52bda2d2545447db9274026e5': 'plus-circle',
  '98632605d134e9fe10c2d304c360301755807892': 'zap',
  '98c01f6af44a12914232ce6ce3660665dcc10f5c': 'Tooltip',
  '9aac55d5231b842b59c4320bf314217c34d12887': 'trending-up',
  '9b77ca1f794e94847284f54025f63a9ddcedabd4': 'download-cloud',
  '9bd1599d504f33369f386579819b76a63336ef14': 'bell-off',
  '9dd8539ed65a97d338491e70bde1b76de0a1819a': 'calendar',
  a0503744f2b200ac0e670b417ce52d91bfd1dd9b: 'toggle-left',
  a1d7308ba323e76da7f91ee8dfd16032a7d34d2b: 'power',
  a25b292558a2f489fb528ce8412fead59a68b4c5: 'rewind',
  a2929eadc104626073f8b57f6438d8aed78ef61a: 'chevron-left',
  a3f40e5efb88e8adf1fbc48d6f8c2b098092ddaa: 'menu',
  a4731b8d3db730dba9da734ad502aca4ffdbeadf: 'chevron-down',
  a56a8d94bb226d236a0df17b0ebe39f7a5460410: 'file',
  a5b999e40e89d19c7207f00adaac953e67511025: 'zoom-in',
  a62148d11dc7a269a52b7de8b93e18cb87b55ccc: 'corner-up-right',
  a70a7973cc1815b6ee68887c606902d4bf98121d: 'message-square',
  a8833fd8a7e4db2b28abe85458e77c11e9a83b3d: 'Dashboard / Top Navbar',
  a9748bd7a7b6c2be12626eebba560df2447e94e5: 'bulk-payouts',
  aa5e9ecaaa9a16977b1439b9985fdc390dfa6888: 'credit-card',
  aa80b9a02513c769903e111863064c69d0cd5f55: 'minus-circle',
  aaa86a2d2adce8d7d3ca4ccb7fdc73ae4a1fdc25: 'eye',
  ab0ec409113ae1eaaf83ec27972642de973b15f6: 'play',
  aba22da852e03403a1d5586807fa696359605547: 'trash',
  ac0d6df3ea16344124fbd06f007336a60f8ba5de: 'minimize',
  ac2806273d1076ed2b88043c54c4f891ede9cd3c: 'skip-forward',
  ac4ff43c790efe035353e8d6ff0c2a50d5eab2c8: 'cut',
  ac6403075848a1d530facc5d40d85dc805f99dab: 'arrow-right',
  b1107807b0446233391c7760bc71c53af6dd1afc: 'volume-mute',
  b1d38d6fedf8dee1784a66bee0ea56ecbcec5d71: 'edit-compose',
  b22a1b58052ee424324742d93827b1535bd602d1: 'upload',
  b26215f2cd6c5aa68cf0ccea40db4296e4eb7098: 'play-circle',
  b590061bbbf90559dea364c2e8954c1ac977b85d: 'cast',
  b5ca16e5a6e6f1db4375ec9b8acb2cc5d8e29ab2: 'edit-inline',
  b5e27e43965b013ac34b0b360ebd3605e37d33f4: 'phone',
  b61ba849e27f7c7f11c233279a3140227f301fb4: 'alert-circle',
  b7713f5808bf9e739c82aeff93b57bb99c11c420: 'phone-outgoing',
  b77db793be9a8303e376826fc9aea4e6a9d32d23: 'export',
  b8807082ef8a3f8f8daa7898eaa209946e5236ca: 'chevrons-down',
  b8bd3d60a30bdb1f3824ed9a6a981a59bb22b728: 'external-link',
  ba5917f28f36bb35d505016d4bacc8df7807f23b: 'triangle',
  be91dfb895cc9e0de19fe6488ae5d97baf2e319f: 'italic',
  bfaa98f91dfad0da248d83a161237165aac785f2: 'help-circle',
  bfb1eafa53e320f1319631ae799da375cff679ba: 'tv',
  c1824d91771423a3f38634e8e962585ce88ed48c: 'file-text',
  c187c69ff9bd42088d199bfc62cce0ef34a80665: 'app-store',
  c32d3ab4b628362a932146736ac91a720e7b72c4: 'stop-circle',
  c4630cba5dada7a4dade9b01436464d259530d6c: 'life-buoy',
  c58c1bae7adf7e64f45ae8095116f07128de3db5: 'codepen',
  cb7aa2b37d0c4ce8f5c887f2440468659ee36a35: 'arrow-down-right',
  ce683f17dfb6d27eadc458f5d09b54dffbd5897b: 'arrow-up-right',
  cf85f3f35ae0d8624a75e888d000205af191ccb9: 'announcement',
  cfb33e6e8d5d1a93e7f940dff866aed8f3f44871: 'hash',
  d021752188be39657fccaed37349b5bec1fc2d97: 'arrow-up',
  d0bccf0a71b114539db8cbd7e5ac9a55fe5218dd: 'chevrons-left',
  d206c80a4d3be66a540017e85bce57b5500008e5: 'fast-forward',
  d295ebae21847bb04dd3180726c15f356bb7f7be: 'phone-off',
  d363e054f66083f76c7e079b2bcc1511197b2b01: 'briefcase',
  d5683fd1da720c1dca2bb1fb48c337ba8ad7136b: 'trending-up',
  d6f06379bc794fc4a8bff1b00f78bf2cec709ff4: 'grid',
  d7b5edca6b03bb5306c1bdccb22fcd78a5db8da9: 'volume',
  d8b04a27bc3abe8a3c85a51c8dcf83119948a750: 'headphones',
  d9363e8e0b154d877505c3920d9d4f7c543266a4: 'power',
  da320b31ae12ba8940f01cadf64fd781d0c052c6: 'lock',
  da9642e82d5d972218d6f575b710402c1cc2fed6: 'heart',
  dbcbc12e0c248ad07c586a3b62b54c34d3fcfdf1: 'disc',
  dc199bb0f42380e6002d65799159f8f41c952755: 'stop-circle',
  dc2699fd326c8d4109bd5f4a0cc15389a69930c4: 'history',
  dc60b37e56862e46f9b9585c6a8a4a204f48bfc5: 'my-account',
  dcd095bb03a11a9ca410f8ef76ca44f7408d6b84: 'edit-inline',
  dd1f849eaa6bb569b7df9662e2278ad400940632: 'user',
  dd76b75590775e877ec29da41f7494dc16e603b2: 'sidebar',
  de09150d181aed976c5cccee3c64215623d64f28: 'align-center',
  de1ac1673d3bb28aea1d984abf8e0cc71cde71ab: 'flag',
  e031246bd86bdb75a6e957459b4b2cc13bcd0895: 'mic-off',
  e0e2bc654e1850ba4304aa6d5c8dcde4c10dca41: 'aperture',
  e11b34dc4c011da0c0ea2437c21ff4c72d9eebc4: 'upload-cloud',
  e132abe1baa9e091cf67581b3b6ee5b71ef7d9f2: 'bold',
  e164b1f37a8f09e9696105259ae30426f0312656: 'align-justify',
  e2102dd30e8453abe88b8d722408f9d7129f111c: 'file-minus',
  e40ae7d65a3e70790dc9bfc24a092e254b8fe61e: 'download',
  e452216340a26f7e0d9301e9298346dafff717c2: 'pocket',
  e63d2e2df68f8f50574b88f354a5c5f6ab92a952: 'settings',
  e6dbdd97101a7a7a5d97eb2f6b1944970d2dbb4a: 'mic',
  e6e36b26e157b755795be113b73288fc069eee7f: 'eye-off',
  e710876e1455a376e7e835843b7804b64ae64e6b: 'payment-links',
  e71652262327824a4623bc0e3f4fd2da41041f25: 'sliders',
  e79941961baf3ed7d379fde0b1a454ee1abedd75: 'paperclip',
  e8092627177ea2447c4d8640ef071670c00769b6: 'mic',
  e886ee5e37c4a0dd90f9356897c2e55586f39836: 'shield',
  e9d0b6d2731ea8e06b8649ffe629339dca9710b7: 'reports',
  e9f7dc2eb6c040d7c3a400e5445bd6321024d1bf: 'minus',
  ea72d98ff823600c8c53fe550a578338de62bb37: 'cloud-lightning',
  eaca28c1e83156d8178171e320ebc59da60a5004: 'copy',
  eb184ed25df17ea3a13b6e8aa6cd58627a12b164: 'x-square',
  ec1e0ba51c96a303c21b9452163663c5ea247e5c: 'sun',
  ec43e56376f6e6d172bce8e0b286c2331fa1ddec: 'message-circle',
  ec8eacc5acf3edab6a244877a14893b53d491ac1: 'home',
  ee39426359cf9471fa98d31ca98e40ae26be22e0: 'globe',
  eebb420781fd5571aaeaed40121019c995d5fc70: 'arrow-left',
  eec95f907f3cb37152418e0735e94338a96717ff: 'shopping-cart',
  f0ade5fc1949966c888fc45610dc81380a3b8602: 'instagram',
  f0bb17a6ab758eb19c6d8d1830ec47c5fbd2cb19: 'camera',
  f13125c43dcbb09350b7a996b38b499a40eb1515: 'cloud-rain',
  f34cb3f46376cf3bdacf3863d1d57cffbd3f7c0c: 'twitter',
  f41454bed59288621ee8168e71394653646d9112: 'video-off',
  f552929ad9204fc98c4d6a0f3ad196af336e676f: 'command',
  f60dc76c1e04ab15f06c262c02b960624f378215: 'droplet',
  f671737d4b0ccd411ff35dbc229f15d37885f58c: 'send',
  f7726b385369fe2e7799f5feb4459dbfc1191402: 'moon',
  f8642831d146b9b1053994324eb942b8f292d661: 'list',
  f8765c9ea16917e995209b978cb9c7003f42383d: 'check-circle',
  f8b66ddb68c62d8726c6481030bd6c432dcb175b: 'phone-forwarded',
  f9633fde748eaae4c5345cf66f29be11ae3fcfce: 'bell',
  f9eec7cbad1383b6301d72bb716aeff30d74c4b9: 'radio',
  fa0803a94656972847678ae261c77d4ad2ad214f: 'target',
  fa8078c54c106c2f0d3475c22bea824ecec879d3: 'airplay',
  fb24415de42953ed47df8b8fb3fce74683ddba57: 'dollars',
  fb38d99d72deafecc1f1bb033edc1038d1f3c65d: 'align-right',
  fce1fd363ba1683bad1586cc580530da240b0635: 'edit',
  fd064bfede73a330bdf0402dc849030f5607fc33: 'wifi-off',
  fd12cf15735f5178856551c753ee228b865a5040: 'volume-high',
  fd4d573099d6f1d691cb3ed6c43124722326659a: 'invoices',
  fe5eacd083d50fff6035c554c0c3fcfb3e31c2ec: 'play-circle',
  '89affaa18c972d661e866cb1f5c3882424d539f6': 'Browsers',
  e792328de5953d34fcbb749c3569fb46061dad6a: 'Wordmarks-Logos',
};

const bankingDarkComponents = {
  // Components
  '003d08a00aa841104a655caddf61a1651f85ff04': 'Link',
  '0245d993ec15fcebd8259d8bc13053012301e4d2': 'ActionListItems Group',
  '091a3153a351da32ee0ccba9f1a69298f2c3f84a': 'Radio-Group',
  '0a8ec718d764eec8c683f5773e616f627d5c9691': 'BottomSheet/Header',
  '0b6be36599ba7e55194f6137990da07100de3a62': 'Code',
  '163e89006986f8b9fcb8555f2f31e0e8a4a7e352': 'BottomSheet/Footer',
  '22024c07a64fde300d410f2614e9eb1ff9e545f0': 'Tooltip',
  '2b1782dc5ec49a7574c6898db90d191616ea4ab5': 'IconButton',
  '2f277319949886cb9ea3ac7ce2b7893934bbdf69': 'Spacer',
  '3a89c35dc57cd0cf9c77b9726b9bcc015d9566ba': 'Modal/Header',
  '3aaa96b87822d7f008a52dc59301e400974d4392': 'Modal',
  '432153a6a9db34c806e34b80e43937e43b1e0fef': 'Switch',
  '4ca33c2116254bf6b28bdbab25e6a9a304d7c7e1': 'Checkbox',
  '4d05716b772e0a9d9b5cd4ac71d5b196bedfe29b': 'Counter',
  '51c78bdc7498d7c935776b5da0863a4516a48e82': 'Bottom Sheet',
  '51dda34e84d19525269e80ed5b26f700ef8878e9': 'ActionListItem/selectionType-Multi Select',
  '6121fa605305d59edcf3d6174e1425131b9888d1': 'ProgressBar',
  '6e3ddeff38aea7ff19d02655fc274d6a008b8a2b': 'Title',
  '729231e49c0d22b1bed122afcda02da287960b7f': 'OTP Input',
  '7aac900e6bbb79c9e87caebe320f55dc08c3bf73': 'Bottomsheet Head - Grab handle container',
  '82e03e173c33e606cb8f9c49c2042bc440cfc15e': 'Select Input',
  '8bf9441a2382d9692d0be812f276bf3b7cf82304': 'Alert',
  '8ff65df6fd2ece9378f6c973429b9fb0b876bea9': 'Skeleton Block',
  '9937aba7bdd77a3c4bbce7775986bb763513142b': 'Modal-Body (NEW)',
  '9b9e58ddb16265e0eed88e2288ac7e88fa995648': 'Dropdown/Footer',
  a0c9e6efa1c48a6b0b10a3b2ce3d6af3e232979b: 'Password Input',
  a8e520b9975367d50d17c60be3a791b8a3cb1bad: 'Radio-Button',
  b232a943d56cf5e470135ad17d62aab33e804809: 'Divider',
  c003f50f15cf54b457910745c20e0aed80bb63e1: 'ActionListItem/selectionType-Single Select',
  c2a0451be604aeaecd9bb86ef8403a3400d869a3: 'ActionListItem/selectionType-Default Negative',
  c613398047cf600ad9f7c7c8d806e9ea724b06cf: 'Card',
  c9c84b85a176cde512672dba01d72aaa66d21aa8: 'Badge',
  d8dc4161e536291f8d85e9be5eedd1743ab29360: 'Button',
  dab51756fc37ec7e090f14becd7e9ac3053295f9: 'TextArea Input',
  db0dee870ed76e54a34d2665aeb27989b3c00afe: 'Text Input',
  db4f6572b5e388fea797f046cceb1bd3c6f36f30: 'Amount',
  dd99c560705ce6335217785ce7f8efe5270c2856: 'Spinner',
  e1767a7c71c475221cb5f09a7369de3d4f098313: 'Indicators',
  e3549f7020e86fae5271c09c4f2fd4b20102df38: 'Dropdown/Header',
  e5fa2264519ffc67e70a22841b8a32e18357a25f: 'Text',
  ea6910e15594c9f50c21311c8d93f325a1c30df5: 'Modal/Footer',
  eeddebec6ce9e44a4e6cb2871333bf1a36ff04de: 'Checkbox-Group',
  efe8a10012ef38454dfb9cf1342c5624737d52bc: 'ActionListItem/selectionType-Default',
  f62d79aec517f0cd7176b7bada076e12d1ab27d7: 'Heading',
  fee722721f71351976176095b6d4bb0ca2e5373d: 'List',
  // Icons
  '003a5912eb703e833b60dcefe78189c5052d2fec': 'radio',
  '00eef13027ec51c6edfc7633bb4f92b6b9b942d5': 'folder',
  '02cdab96a2c0ecc561fb68d809963924b3ab289d': 'award',
  '043646828088ad66402e1bf4e019299818c62d49': 'briefcase',
  '04a670a7c8c05e900c1faea53b04c8fa721f5f94': 'calendar',
  '05287b14b42d4d11a23d39cf24989b79d81a06f1': 'book',
  '0682b32749dc80be8b7d9989de7ea2b6558bcbaa': 'instagram',
  '073a56c184915fc5143751c35fe8a2f1b4b4965c': 'upload-cloud',
  '0a439d6979e0d7006be8d179f6d7e430502ec13e': 'twitter',
  '0c54d47513ff6b26342378686b1b880396f329a3': 'tablet',
  '0dfcb6abfd24178a84bad6bfa12d98904c7b9736': 'offers',
  '0f82b96d3f789eb133167e94ebafe835cc5c7d52': 'folder',
  '10bd948ef5b2c5b2c5a7fd31807d3276e5a8d12d': 'phone-forwarded',
  '10e727747a679bf6891b79cd83a7b1e61485c934': 'aperture',
  '110082a5a05cb142249c5ca55ea92d57d6b77e1f': 'user-check',
  '118bfe427f96413060e5c5bc4f1372f1021eedbb': 'minus',
  '129cd6f57b4b2eef0f11801af45010a83643b90f': 'send',
  '1307e7d783bdc6345369332b6eb70f0ea3769412': 'delete',
  '15fdea08f62b2fb3889373274a2e750df5c67565': 'chevrons-up',
  '16267f4e2962cd6976f5cb5c03350a16c049d3bf': 'arrow-down',
  '163a5671d035b21b7f9b5a91c91ac2df8351ac56': 'thumbs-down',
  '17ee700539026a45a117bab4220bfb87a5340029': 'my-account',
  '183242f6126eb70a2fd8968504ec44744fde0b09': 'grid',
  '191adc8b0c57234ba616d17a2d40e52acb62f6d9': 'full-screen-enter',
  '1ba7af527d5623a4b8b5f128a0ce890e8edf7839': 'life-buoy',
  '1ca4b02908cdca86542909e186396c3135d4387e': 'file-text',
  '1dfa6a1a17fdc2682da72782497445d5a851a748': 'power',
  '1e72612bf0d8da0e5dd15a44b8c3be361acaa434': 'alert-only',
  '1f17830e0100b4cf707f8c1226eef4f6e66479e2': 'plus',
  '1fb71f568128258c7217eb804826f99a98ca152f': 'shopping-cart',
  '204ee02326a8a2d03040a06b67b8f356331469b7': 'eye',
  '207f697fdc4eb5e9653b181dd86ecd21b8cadd1d': 'link',
  '228537eb54421d5ad98c3c9ec10fb7fe033a1d72': 'phone-outgoing',
  '22ae00a37be99faf2d6a2c6b91b111fbff6409a7': 'pocket',
  '236eb58b714f6ebef5d9d13b71a819d1a560745b': 'camera',
  '2403e68028d435c47a9ef055fc01435ed12839db': 'airplay',
  '243c99fb419e2960bd25f8544257a4c428e3857d': 'percent',
  '24785e5ace2c6d96d2f5ae6a63f06e9c8e8204ae': 'plus-square',
  '249fab4270f9d563ff8ad60322bebcec279c6dda': 'download',
  '263d474329558010ff8d7aaa06585b611798f967': 'reports',
  '26550129094bf5557699045e9e1f84f2e8ce7779': 'shopping-cart',
  '26b5abbc1068c554b0310a97a9966e45d28ef1ae': 'wifi',
  '2763b5cb3b6749b3781a9b4ba83337bd134cf244': 'tv',
  '27ea4555b20d265fc02da6f950854bdeb984c2d2': 'users',
  '281417751f81532db9afaa2754c5b7915a601155': 'share',
  '28245eff5786aee727d14dddafc5635ac2cfd97c': 'clock',
  '2924027d2ea0500ab2c3db1c5b424197391fdac2': 'subscriptions',
  '294ef149970f72c5cd41453bea0d6a17ca4a4639': 'toggle-right',
  '295981f016c7a43dc75fe4b2bb0c12d0aaa7c257': 'unlock',
  '2b09be891653a2570e67c37e64af7b6f8e5c7867': 'circle',
  '2dc86b9dd6c3babb0e51e038063a05f2c9716797': 'disc',
  '2dd6a5de994aab81fc0102249bf88e1358495511': 'italic',
  '2f28b4b92a4c1959ba24a08cb7a33f0f46076149': 'mic',
  '2f852ebec8b0bd42964027122eae0dc01b78a4dd': 'smart-collect',
  '2f866588ee1e5476e8be50398cac65cdf3ca36b2': 'droplet',
  '315a98afb862926fc9fdfc5a4969bc24f28cb76b': 'routes',
  '322edd8d66767c523372e3c979519635d3c38cb5': 'package',
  '33b8c469e385175d347e61851d5ad93873b966a8': 'bluetooth',
  '3462f41e9c8193ebc6d62576672ec3a94769ca65': 'invoices',
  '374ef6a36c1732334f02b0aaedc170be23ef5e80': 'voicemail',
  '37d1b508116073d520737e9d0b729991e0cb767b': 'edit-inline',
  '37e3f58dc249084cd43553d6ccaf54bf8fda92d7': 'info',
  '391a8e6adde83239fca2c8a792b80c0f1ba72707': 'stop-circle',
  '3a1aca8db4c5e9ecf0b62066d0c53a63b55a96f3': 'video',
  '3ac91f2b2b7b9d10222ff426308160a1403e5ad1': 'maximize',
  '3adec28ea455494d0cf7b8362785dbc27b6fe60b': 'codepen',
  '3b972b3dee9d8444f697dfe2ca21a4c6a0459cef': 'message-circle',
  '3cd15f84b0439e697b8f023d2c3202e5556e2eb9': 'skip-back',
  '3cfd0fce31525aa345b83d3644a94906778d3c15': 'file-minus',
  '3d7207001ffecd7837b96317f421a5fe3fc02bc6': 'camera-off',
  '3d9a2d6981a3e3ca96fb9a355645a059b09766d1': 'shuffle',
  '3dd0e7a32aa6687241817c6e76c3198c9cfabd14': 'pause',
  '3f24333d37e0cefe78b32918ffdbbb88d233b84c': 'cut',
  '3f7c286a1c137039b89a91416e9edb84de8a8546': 'bar-chart-alt',
  '3fdea92719411ca98fcd3108011b026b6a6159e8': 'umbrella',
  '4172e6867ee78256a64bf277d3d111def1c70026': 'mic',
  '42e08074183ce3d444710fd550338856b2ea7358': 'refresh',
  '44528602b429771830929daa08e0460befe6888c': 'log-in',
  '44b8b008a7c2a41d79a8400c774366b1f9f43137': 'corner-right-down',
  '453f2af42d7d3245165157713809036b5ce05c55': 'dot',
  '45c93c841055aa591d5376a47654857e5d502b95': 'align-justify',
  '45eb897157baa24652fb5f833deeb5ffcad2d36a': 'watch',
  '464a8e4885a677768435bae7a64161a6e495519e': 'slash',
  '470a58a2bad79ee2f501ac629a57fb56a86b2fa5': 'thumbs-up',
  '472f6b45fa83bf5627813536814b4b0d1d032794': 'sidebar',
  '4752b1625b2489175e8e430fa639574454ddd58f': 'save',
  '481438e1533872b2700c9cddee9a4fa453f10fbc': 'play',
  '483b3cf6606ff1a508f908aa487ec41c6c4c572c': 'repeat',
  '48612e840d8531b84bb4af9fbd9d491c896ba200': 'close',
  '4958db933ec3f42dddc0da3a9efc743bf3ad3f0e': 'phone-call',
  '49bb9819cb895dad97bec93418a33ecfddebd9f4': 'moon',
  '4a704e8075f14cb9f0d226fe15978bb33a323301': 'x-circle',
  '4b94da74656da77d632e615f387a39d580cb06d0': 'full-screen-exit',
  '4b95d216ce33913cd9f4ecadc7cbcacc78703fb1': 'monitor',
  '4c8ac8e2a6896928457add034f2e4d24f1e1ce72': 'file-plus',
  '4d2036ef75cd7961022e7892b73f94c1513dc7ab': 'full-screen-enter',
  '4d39e83895c086fd0aa77b00bf63ae2b76d4c5c2': 'trash',
  '4e6c0f5a66c692e4375825a918e350bb08f23706': 'arrow-down-left',
  '50b4cd585bade8b2971d865907c1a99438243675': 'mic-off',
  '523d6d62d7822b97cfacb6c22113e265923ff86f': 'hash',
  '524c7f42c3947b031b7c0a8e463ebeea8e8400ff': 'activity',
  '524f580d805952451df632190d0ba9134ae9ef84': 'video',
  '53e1bbf74312cf245cf76f261a744fab0a84376e': 'payment-links',
  '55a946183aeedc888d3c6c9ce35ecfd2f8e6722f': 'corner-up-right',
  '564e1ec7a11e0a34e1dc730aa6a5dfa161ed7432': 'crosshair',
  '56d7987f14e5ef8222cd5686dca5c58efc6cdc44': 'server',
  '57db6a22c95ee0e80ee2e8802664db0e3162ca82': 'corner-left-down',
  '58b770160ca0684b0333b8429a1c48bde38208da': 'mic-off',
  '5911749f7a79bbf7f5461eca4f10c9ee70f58011': 'volume-low',
  '59da881a760443b36431db2a37f5e3e07a9ecef6': 'music',
  '5a136029edbbf72c109ab02cc3fd52f59f339f28': 'message-square',
  '5c790ee165f9d490394adb7bd36bae69a9b2e487': 'transactions',
  '5d2be15b15ddcce8c73e6c29adb6056b0a9b406a': 'minus-circle',
  '5d75826e12ded2b30d81f3d6d07eed34ad4ea53a': 'flag',
  '5df0c7a51661a001dba02faf802a9a902b9ed0e2': 'cloud-drizzle',
  '5f260ca885aff1469533d69a58ee677c1768ce8a': 'phone-incoming',
  '5f5a19609b0bf5d962b7cd9670302f2e2286375c': 'github',
  '60027a68a004456583fcfd400a520e8e6c64f011': 'edit',
  '6124f4c2cbfa27dacbc1b7655e478446499ecfa8': 'chevron-up',
  '634f4d39bcba5232aa68c06e2446982a4c0c085d': 'settlements',
  '6547dcf71c2023d85e3220308f2a09ba43a268b3': 'crop',
  '6688b7a5920e8ac258a4ad801b253e8019ed9b6e': 'bold',
  '66d20308014695c611e7729a562b08ec8317ce9d': 'dashboard',
  '67120c9a010c939cbd813e27252b40970c02d653': 'trending-down',
  '678c05961c543636e8c0c4d760dffe1107fe470e': 'phone-off',
  '67d1ace57eace82b5b2faf98099cbad7ffe0c94e': 'corner-up-left',
  '6aead3d8f67fde82903a7bf879053bda79321ca0': 'pause-circle',
  '6b7eeb1668cd0191c8a304bae1327dec9c1cfca9': 'upload',
  '6cb224cc9a5687ba5fba99e8289113b35d166325': 'payment-pages',
  '6e5dd890d7e7c545cc9521f340286bd9c5b54b2c': 'chevrons-down',
  '6f11c533a87a401cec59350931cd767db569b438': 'chevrons-right',
  '7082650a78c8641dc37fd81bf6ed9054f773ec8a': 'file-plus',
  '70af6dae0ecad767e103a98da57e5eee12b1161e': 'radio',
  '7119febe9c1bc065bf9a692845846a15615893fa': 'zoom-in',
  '713c47dbb4a7395e2ba3e5dca3eb977e0d2b07d1': 'gitlab',
  '7180d3493413959c5eff56232866c45826e4d2de': 'alert-octagon',
  '75fbf92caf00a45837ee2c18d8e75d1d45cdb16f': 'film',
  '76c834e4cf0274f8e6803601a5374e012f66a1ce': 'filter',
  '77e72538b01a5ea043d97153a3110ee849cd9589': 'link',
  '781b1d5ddf5485b3300acc2a65b5718f13952217': 'target',
  '792187dc2f5d6247fdce2c0ad7af134e254cf12a': 'play-circle',
  '7b15f0e81f22079626fcd9439d892594b2db9593': 'minimize',
  '7ca35cc55c9fb34ff1f53fbf3578292b1dcc71ae': 'menu',
  '7d01a065bf5c7295eb53c4ce68f4c8b749b5d144': 'grid',
  '7dbcc878fa38835ce3d4034e22889d5807ca3860': 'settings',
  '7e4a753acf80c6141b22f1cad455b1478ff8f353': 'align-left',
  '7e6f1169ff2c85acb2d190321a64e1a71009ecf8': 'bar-chart',
  '7fb401a3963d2c5309613011916292c77f002dfc': 'pause-circle',
  '800815e0eeacc45febdc8d945aff1b8e8e7685be': 'compass',
  '80d66ec798f3a3913c165439c734746977724be7': 'corner-down-right',
  '80d82f4d22a2947363c52bd2bf40537f915f1bce': 'map',
  '81b9c2c980f817fefd431438d84ac78d56099c52': 'battery',
  '8227c0e7c57182bfe8f1b381920794fdb2ff1584': 'user-x',
  '8460f3e54b00b004c7230c0bc7d8d2a3088c732c': 'more-vertical',
  '847b03642e296512bf729db337089f9402c48555': 'search',
  '84a8a7eda2f8c278b2769b170bff147c049868d1': 'repeat',
  '85f5ad621289617d5ba4940448cb58d85ba0dcfc': 'minus-square',
  '8729551f83f26a840e7044941b8bfbe3bc281628': 'user-minus',
  '887d427bd90fdc8d5bf13ebb011177aab5dcb6e3': 'loader',
  '88aa3ec2300e7c6bcec9181ec0d1c4c999d65fe3': 'maximize',
  '89ff4a707145015985bd9616fa9d3a90b7611194': 'pie-chart',
  '8a12b5a71ffa5de8255829bd3238a69bbe42fb7a': 'trending-down',
  '8ae21d8e22c4931cca4914867b536caf1266cfa4': 'battery-charging',
  '8c508898a156a7dcdf4f2f7a18b26958d8aec6e1': 'printer',
  '8d2772bcd8e37042ebca2997a821fd21cc897ed5': 'edit-inline',
  '8e233444d834e22fb082b0e8ad0881e6dbffaa88': 'zap',
  '906142c3780756e8c9c2e1ca6fdfdc3311248a3e': 'sunset',
  '90c602bbb53948ab174a15c1cb2119aa3638d6c9': 'paperclip',
  '90e40b76668a061e43cf24aa8d02e2f2d7d11eec': 'align-center',
  '90e4b0a736f135d5e449447d9872c630fc88d429': 'cpu',
  '9196b4b5a9e3abe4406bbaaf4369c7c30595d79f': 'check',
  '91dbebc7f5b13140e2f4f475cb5dc9d6523e8327': 'sliders',
  '92a018368bed56b5432bae8c5ef673b40030f21f': 'sun',
  '92d3b9ffc8449f8111d46c1fac18ccabd94520f1': 'anchor',
  '960838cb108ca7c16f8bc6fe7a9f808731fe7332': 'speaker',
  '9781e845b29f2a8862ead1e4ed7781f9bbd3a2dc': 'shield',
  '98eabcee443ba94116c0be8c55411403e730f7a7': 'copy',
  '991ab783b863227cc6e79f1d7b01e700432f9eaa': 'star',
  '99e79a1c040cfa46f39a93b45fffe2522f488688': 'underline',
  '9af2d89160b957564877e2cb840a81c8a7356964': 'cloud-off',
  '9b6944311f9d0a9864a5d28d330e43aedd193b7f': 'sun',
  '9d9f38652350f82314696d3c6b1eac49605da1f5': 'mail-open',
  '9db6bcd3cda6350eaeccfdd962aad6e1a0b3dd76': 'tag',
  '9db724f948da98ade9342d4d8f18eaae7192ffb0': 'trending-up',
  '9e02287ba24b356b2bcdeb6d826082bdfe80d5fd': 'settings',
  '9e1070605c3be8a866c3136df74efc469c62e80b': 'attachment',
  '9e64850ba066022f52e15042185ad4fdc96dd813': 'plus-circle',
  a0b7dd1652f6a69c7336e03e65d39bff04c87778: 'razorpay',
  a1e176d61a54c166656df78bc71c6a7da0f31e03: 'app-store',
  a2246277df5c74c5acab9325282b1944298f981d: 'log-out',
  a25b292558a2f489fb528ce8412fead59a68b4c5: 'rewind',
  a277b2b4d8d7a5c0638811dfb1d3d86f13a173df: 'user',
  a3d71ee4cfd903c75dc2cc2b727cb527f959fc59: 'flag',
  a44b7db0eacac4b8ea5ad2a8a64caa55345458a3: 'chevron-down',
  a4b26b2394d3a2e61ed306b65ea53a69e4e2f0a6: 'bank',
  a6d13bdd05bfc13d1d83f73819671b1e91ad8cfc: 'payment-buttons',
  a73bc1e858f98d00fbebe64154ab79293edc6ab9: 'bulk-payouts',
  a7512786d41f43e858f50f7f4e09328a15a5426b: 'slack',
  a792b81d4593dc481dfcbbe8f72e0c246d90c5e7: 'chevron-left',
  a7fc051ee70981d3ce2b5eee9a0323366b983d33: 'rotate-cw',
  a822d7b4513c5e27282236151add051fb49f1e20: 'eye-off',
  aaf91e02f08e75e9c87905bfc3f26498d2a44b3a: 'zoom-out',
  ab0ec409113ae1eaaf83ec27972642de973b15f6: 'play',
  aba22da852e03403a1d5586807fa696359605547: 'trash',
  ac2806273d1076ed2b88043c54c4f891ede9cd3c: 'skip-forward',
  ae365c5c01279eef73841b3c1c1b9fa5c6f51d5c: 'shuffle',
  aeefc48ce31914793372ae444ba43181e7c8d68b: 'cloud-lightning',
  b03195752babb41aba96890f6cca626f6ab42f2e: 'external-link',
  b1107807b0446233391c7760bc71c53af6dd1afc: 'volume-mute',
  b1494f1798d32485330ce6c6f05babcde37fbdbe: 'cloud-snow',
  b16fd816dd21cb5a21864e7195ffd3df3292fff2: 'qr-code',
  b26215f2cd6c5aa68cf0ccea40db4296e4eb7098: 'play-circle',
  b304456983e8438f6cdb7b7460c506deb6b6af76: 'file-text',
  b3f7a81fc8646c6a854a385e45b6ad0629dbf54d: 'smartphone',
  b4269f8e9e9ed21f3e2658dec80fb293e5a7db4e: 'arrow-up-right',
  b4f6d14f422792168025e4cdc594179c9f08e302: 'wind',
  b5c0fc5311a210bf1d3af4f0df8c887815f6d0c5: 'cloud-rain',
  b60efe5bab5e7396390af99bceb1f941751bf498: 'pause',
  b93cb05789debf826fd0384319816e5146b3e481: 'coins',
  b94bac6777091946db09e47ffd22bb54cb4b5a20: 'align-right',
  b9d91435726dd0e570e8d06c42531c52148d09f8: 'bell',
  ba1ec54e27b444d8261d7efc0fec3f2ed687c5f8: 'bill',
  baa93e04e798fbf4ae8a53606c8454ce2ddd0db2: 'globe',
  be04b2d2281cb91081a3b70370eddc4e6374ea6b: 'stamp',
  be1bdbb986eb48b80e8e38507ebb14a8b524b98d: 'check-circle',
  bec4b6213962ab46d04916b039fad322b9a9ec48: 'bookmark',
  bf3084f2cb67847ddc7d6cda8a6a96af8887742b: 'lock',
  c2895ab26c3b3f7e9ba07bbe589ad2b6bdd88c2b: 'bell-off',
  c2f8191fba835cb287af38d0b0e887d70b7db867: 'arrow-up',
  c32d3ab4b628362a932146736ac91a720e7b72c4: 'stop-circle',
  c35ac6ecb8379d9e08fbb2dd1c96bdae83c2070f: 'layers',
  c36890d1dca4082b816c8fdb94d9bf1815b10202: 'file',
  c438badc5a1c66e72aa08b3c022769a12b670557: 'list',
  c4ed8d4680a4a5ee3087118e86ec5bccfa97d05a: 'customers',
  c6f1ed7d9cffd2db8788fead179db266b02c200b: 'mail',
  c8db719cc997aee231ab0725809d80711b3fb3a5: 'inbox',
  cbc5d18aea0e312a8e9994c29467f889ad41f0cb: 'chevrons-left',
  cc140774d2621481ac3501fdd3ef21242316df80: 'menu-dots',
  cdef21116716e8ded6e83260980975828e36449d: 'cast',
  cdf5728b9d5e6a288995589869c494d2c5c03f26: 'paperclip',
  d03b50674ecc8633eb7bdf3ae71182e749718226: 'alert-triangle',
  d06bf88ba8497643ecda0e683c7fad65a3c47d38: 'edit-compose',
  d17e661f2af3700b92921f9448f0a7f7a17c2683: 'cloud',
  d206c80a4d3be66a540017e85bce57b5500008e5: 'fast-forward',
  d46dc3f65a2fa4b010e661665baa0946411d98ba: 'heart',
  d5462011f9a8d663ea1774f986b702554a6198f6: 'video-off',
  d5c43ceac33cda590f7d80bb288d0679e9d2a287: 'box',
  d65b01df666dbc888a1b2614ff0d1858b464a78c: 'arrow-down-right',
  d6a667edacc227ef0de9589e2f4a019dca453afc: 'minimize',
  d7b5edca6b03bb5306c1bdccb22fcd78a5db8da9: 'volume',
  d89c70dbadd0f24132a62a1493cd14b631083648: 'command',
  d8b04a27bc3abe8a3c85a51c8dcf83119948a750: 'headphones',
  d93838d71b56159a0ab70c672f3bcc1de1a78141: 'export',
  d9b135f6b5d317065088d4d62bec01e3b3508628: 'octagon',
  dae2ddba9ed0d62adece57dca712228eaea4536b: 'inbox',
  db0d75153bc9bf2dbec655fa062018c6e9958653: 'announcement',
  dce54a66c9c9cd05911d2569dd2b29c15ece3587: 'file-minus',
  dcf06c70ff2976a9bc4e7e431625ebfd8930ac99: 'phone-missed',
  dd0c6f4011dd61950a25d9cfd703e0ccb09848e2: 'x-square',
  de3c4919b58de8d909ba62e79a75e38670eef823: 'move',
  df3cfca47fe55de97f74dc466e3e674537929bf6: 'phone',
  df5e1774bcdce6749c78b53f874f44d41a189148: 'more-horizontal',
  e119840d3157e6472c735ba8a03b2877af0f17c4: 'triangle',
  e22d3b25089a203b91f01a08cfdf18b39e08342f: 'wifi-off',
  e2e092f1c290856a3f5a9df4effd2f8186de2ac0: 'copy',
  e37b1ab70e8fab3cc8c89e7aa685299866130251: 'at-sign',
  e3b2b064a7e656c1d00496faff2d78de3aa5548c: 'scissors',
  e42915bffa68390fd88cefb1217190ac5d8df060: 'map-pin',
  e4b36251666cd3376cdb103893bb348a5c0a2772: 'corner-left-up',
  e5859e9277163f6860f358ce7d410d7a37dbac1c: 'corner-down-left',
  e657e1425f54f9734eefb6ddb9209d83bb9120fd: 'edit',
  e71652262327824a4623bc0e3f4fd2da41041f25: 'sliders',
  e71f50d30e604f5593f6a1e215f606ac1ef475f3: 'alert-circle',
  e84ee701b5789d456232cc4cf8c35034e4ac7898: 'clipboard',
  e8a90b4971ef329caa84a8900d56c3811b34ff24: 'toggle-left',
  e8da7d65018dcbbd097c429d74239a1596f83cd4: 'image',
  e8df13424ba888909f7f400c7a2f15f7158af495: 'help-circle',
  eae5bde818bc6e1bebd0501deb37250e29d1b1e7: 'power',
  eb7d7097a16ce6f81823d4639710e16d486458ae: 'layout',
  eb82da6eb76bc6ead97a099ea819671a1dc954f5: 'download-cloud',
  eba1ee0be9ba08724a3022d6c55a27f4f6ea135d: 'user-plus',
  ebf036ffbab7cccb6ec6a58dd738f9c8e8e33082: 'arrow-up-left',
  ec8e6826e210b7cdd6c5041ce08f6a0621876c74: 'external-link',
  edc9583106e8ce471a2a8b8a0e0f1de15988202e: 'feather',
  ef5e971d781646ed24fb7742384b8447ff904299: 'rotate-ccw',
  f1ca65622de586e319a98c499d3f7c2cb6de2462: 'chevron-right',
  f296c9a5cfb18ccadd0894685852eca1fbbf3a65: 'facebook',
  f402c29613e4f02ad98c68c2626c99ea10df20c7: 'thermometer',
  f620b4a8b4a9e218f69f4a1f8c6445e55941eb21: 'arrow-right',
  f6a031a81cc2b44f06a84f02406ae4e87a15dcf1: 'home',
  f6b83216debba71d473f3fc2b22ac525b52d4a03: 'history',
  f6f2eb7b75b9fceac90b2c8fd9a9194ed0ce8fb0: 'corner-right-up',
  f7893733879f9167bea07ae4c984a0383016ea8a: 'chrome',
  f796d996d796a845287375e5f4ffd240e643e852: 'navigation',
  f8b5c20b29fcb304e8c58951f0757c0d74a59ff0: 'save',
  f8c9a7446f0d6eebd76b1d6ed7b9c21fee7b7efb: 'full-screen-exit',
  fa029ed6debd27fef6df47fc74729d8504f14388: 'clipboard',
  fac4cd4b21f651f9359728bccbfa78e626eb0bf5: 'type',
  faf9173196b1545bcc6fb7da9a39956a3fa59d06: 'file',
  fbd476ac46ab3c1e63be70f545a8900034e5bc4f: 'check-square',
  fca92245b9639bcb04b687aaaa80a27840713896: 'edit-compose',
  fd12cf15735f5178856551c753ee228b865a5040: 'volume-high',
  fd556578f0246058e97f5bdf119f4a33c5cb1f71: 'sunrise',
  fdc0f5444d9026d454daa70cf84cefb36ad70f18: 'arrow-left',
  fdeebdb26ff383ba1d0f7d2f72c15743810fc55f: 'razorpayx',
  fee8d91f29acc9e920e9b397a88083df08b0ea76: 'trending-up',
  ff5a70bc907b30ad5d5b1f9c911633ffa14e92a0: 'square',
  '2a89aa3e0efba527ce0e8133adb83d24bc4f6388': 'Browsers',
  '7b07c2dda2b97b7d1471b3c5788ecba1cab94bdc': 'Wordmarks',
};

// const paymentLightColorStyles = {
//   '_Global/_Chromatic/_Azure/050': {
//     id: 'S:b4d52ac9e915b0608d3f99b7e5f7b6979ab49fb0,',
//     key: 'b4d52ac9e915b0608d3f99b7e5f7b6979ab49fb0',
//   },
//   '_Global/_Chromatic/_Azure/100': {
//     id: 'S:4ea4afcd320f878a26010572f26ea5a10ff50d3a,',
//     key: '4ea4afcd320f878a26010572f26ea5a10ff50d3a',
//   },
//   '_Global/_Chromatic/_Azure/200': {
//     id: 'S:774eaf3402ef8eee92c7cea643a53431f62a90c3,',
//     key: '774eaf3402ef8eee92c7cea643a53431f62a90c3',
//   },
//   '_Global/_Chromatic/_Azure/300': {
//     id: 'S:b9463810ca74cd2257ec4fcf3eefbadda792b1f9,',
//     key: 'b9463810ca74cd2257ec4fcf3eefbadda792b1f9',
//   },
//   '_Global/_Chromatic/_Azure/400': {
//     id: 'S:3ec5d5f34eb9860e03160c61fa4a3588feb3f38e,',
//     key: '3ec5d5f34eb9860e03160c61fa4a3588feb3f38e',
//   },
//   '_Global/_Chromatic/_Azure/500': {
//     id: 'S:162c0d9b4c4e1b08c46e4b61d4d217c6bc203c16,',
//     key: '162c0d9b4c4e1b08c46e4b61d4d217c6bc203c16',
//   },
//   '_Global/_Chromatic/_Azure/600': {
//     id: 'S:be8a39f50b6727e4cba22d0989f56dfde195a82a,',
//     key: 'be8a39f50b6727e4cba22d0989f56dfde195a82a',
//   },
//   '_Global/_Chromatic/_Azure/700': {
//     id: 'S:282ad337d074fb96f2c9145c610aefce1d07b374,',
//     key: '282ad337d074fb96f2c9145c610aefce1d07b374',
//   },
//   '_Global/_Chromatic/_Azure/800': {
//     id: 'S:f12e2dd3851d6a6352eee53f02adc7c2c7f7f17f,',
//     key: 'f12e2dd3851d6a6352eee53f02adc7c2c7f7f17f',
//   },
//   '_Global/_Chromatic/_Azure/900': {
//     id: 'S:1c0db90ad2c8cde843a8544b08985b6bc47e8b77,',
//     key: '1c0db90ad2c8cde843a8544b08985b6bc47e8b77',
//   },
//   '_Global/_Chromatic/_Azure/950': {
//     id: 'S:0936f6f09a441f5ff58f2ddf633f501e17fd05ed,',
//     key: '0936f6f09a441f5ff58f2ddf633f501e17fd05ed',
//   },
//   '_Global/_Chromatic/_Azure/A00': {
//     id: 'S:d7b0453e4ee4b0532d4ddd805a3ceb90d9a9770d,',
//     key: 'd7b0453e4ee4b0532d4ddd805a3ceb90d9a9770d',
//   },
//   '_Global/_Chromatic/_Azure/A50': {
//     id: 'S:cebfb0f85ee5baa4224389f46d48d306829ec939,',
//     key: 'cebfb0f85ee5baa4224389f46d48d306829ec939',
//   },
//   '_Global/_Chromatic/_Azure/A100': {
//     id: 'S:af376ff7259b417ab05e88d75ba489e85446a036,',
//     key: 'af376ff7259b417ab05e88d75ba489e85446a036',
//   },
//   '_Global/_Chromatic/_Azure/A200': {
//     id: 'S:8b52efab2b2b34d78c955c08d17c36e8d4134f67,',
//     key: '8b52efab2b2b34d78c955c08d17c36e8d4134f67',
//   },
//   '_Global/_Chromatic/_Emerald/050': {
//     id: 'S:34e7d6e53541226b349c90506fa9332a03898825,',
//     key: '34e7d6e53541226b349c90506fa9332a03898825',
//   },
//   '_Global/_Chromatic/_Emerald/100': {
//     id: 'S:53269b531bf6719ab42db12d9060ae238e165517,',
//     key: '53269b531bf6719ab42db12d9060ae238e165517',
//   },
//   '_Global/_Chromatic/_Emerald/200': {
//     id: 'S:70f95091f9571f2e6fe71a5347c96e0fc36b28d8,',
//     key: '70f95091f9571f2e6fe71a5347c96e0fc36b28d8',
//   },
//   '_Global/_Chromatic/_Emerald/300': {
//     id: 'S:60ae6f3df2729726eed893cd72d30abbb3fb5fa7,',
//     key: '60ae6f3df2729726eed893cd72d30abbb3fb5fa7',
//   },
//   '_Global/_Chromatic/_Emerald/400': {
//     id: 'S:d5d0bd4b9a01f61be6c8cea6c6183e6db20e76e4,',
//     key: 'd5d0bd4b9a01f61be6c8cea6c6183e6db20e76e4',
//   },
//   '_Global/_Chromatic/_Emerald/500': {
//     id: 'S:35a7df32e016864628accfab885e7616396690a6,',
//     key: '35a7df32e016864628accfab885e7616396690a6',
//   },
//   '_Global/_Chromatic/_Emerald/600': {
//     id: 'S:ed684c7dae87475098d50064f6b4a1b3782e867a,',
//     key: 'ed684c7dae87475098d50064f6b4a1b3782e867a',
//   },
//   '_Global/_Chromatic/_Emerald/700': {
//     id: 'S:1b0a23bfad03b0231c7aa03dd34c41ec7ef0a3c2,',
//     key: '1b0a23bfad03b0231c7aa03dd34c41ec7ef0a3c2',
//   },
//   '_Global/_Chromatic/_Emerald/800': {
//     id: 'S:7fd511c5edb92ba248cabb6eb3f88d8db54d3bf6,',
//     key: '7fd511c5edb92ba248cabb6eb3f88d8db54d3bf6',
//   },
//   '_Global/_Chromatic/_Emerald/900': {
//     id: 'S:b0125d2dc4781f499998cfafd27a0670f006ef2f,',
//     key: 'b0125d2dc4781f499998cfafd27a0670f006ef2f',
//   },
//   '_Global/_Chromatic/_Emerald/950': {
//     id: 'S:8ef505310731d37a356f813f57f8b9d951329fbd,',
//     key: '8ef505310731d37a356f813f57f8b9d951329fbd',
//   },
//   '_Global/_Chromatic/_Emerald/A00': {
//     id: 'S:f6ecfd64c278342e448f8f3044bddf7efa23bf88,',
//     key: 'f6ecfd64c278342e448f8f3044bddf7efa23bf88',
//   },
//   '_Global/_Chromatic/_Emerald/A50': {
//     id: 'S:bff793437342884a85a1efbe116108f6147e60b3,',
//     key: 'bff793437342884a85a1efbe116108f6147e60b3',
//   },
//   '_Global/_Chromatic/_Emerald/A100': {
//     id: 'S:08446b40cba558a7794635fe1f99811837e52b75,',
//     key: '08446b40cba558a7794635fe1f99811837e52b75',
//   },
//   '_Global/_Chromatic/_Emerald/A200': {
//     id: 'S:41870f20466e3d75bc07e951600d42a5135e9d7c,',
//     key: '41870f20466e3d75bc07e951600d42a5135e9d7c',
//   },
//   '_Global/_Chromatic/_Crimson/050': {
//     id: 'S:868aef46b282374af5ade975de9525dc160ce05c,',
//     key: '868aef46b282374af5ade975de9525dc160ce05c',
//   },
//   '_Global/_Chromatic/_Crimson/100': {
//     id: 'S:fbeb9125625101d45cbf89ab8a0a57cabf33b9c8,',
//     key: 'fbeb9125625101d45cbf89ab8a0a57cabf33b9c8',
//   },
//   '_Global/_Chromatic/_Crimson/200': {
//     id: 'S:c2ba38478417b04fb27fc52102f554e1b5a9a36b,',
//     key: 'c2ba38478417b04fb27fc52102f554e1b5a9a36b',
//   },
//   '_Global/_Chromatic/_Crimson/300': {
//     id: 'S:8cf314349ecf3f8903650f3185a7af4c2656cbb8,',
//     key: '8cf314349ecf3f8903650f3185a7af4c2656cbb8',
//   },
//   '_Global/_Chromatic/_Crimson/400': {
//     id: 'S:ed9d4397ea71ba214eb97d24a16ee97aafb6940c,',
//     key: 'ed9d4397ea71ba214eb97d24a16ee97aafb6940c',
//   },
//   '_Global/_Chromatic/_Crimson/500': {
//     id: 'S:0b721c730263789f19cfd98075721be5dd606f1f,',
//     key: '0b721c730263789f19cfd98075721be5dd606f1f',
//   },
//   '_Global/_Chromatic/_Crimson/600': {
//     id: 'S:2b3ceb456b8232c3a1b98e710e5ce3f808f36b21,',
//     key: '2b3ceb456b8232c3a1b98e710e5ce3f808f36b21',
//   },
//   '_Global/_Chromatic/_Crimson/700': {
//     id: 'S:684f0e173e72be64c54388a7ecafe6962b9588b3,',
//     key: '684f0e173e72be64c54388a7ecafe6962b9588b3',
//   },
//   '_Global/_Chromatic/_Crimson/800': {
//     id: 'S:e241854ed1075aca11afe1600a7bf2ff24ad75ab,',
//     key: 'e241854ed1075aca11afe1600a7bf2ff24ad75ab',
//   },
//   '_Global/_Chromatic/_Crimson/900': {
//     id: 'S:b5da3023e96256d69e64c7d98f8864ff000d7486,',
//     key: 'b5da3023e96256d69e64c7d98f8864ff000d7486',
//   },
//   '_Global/_Chromatic/_Crimson/950': {
//     id: 'S:baf0bd2f96ea367c7e485d0d518ebf2839ddd2b4,',
//     key: 'baf0bd2f96ea367c7e485d0d518ebf2839ddd2b4',
//   },
//   '_Global/_Chromatic/_Crimson/A00': {
//     id: 'S:e31987b5ca40cfc7d1b052d5ff2a40a51e332e75,',
//     key: 'e31987b5ca40cfc7d1b052d5ff2a40a51e332e75',
//   },
//   '_Global/_Chromatic/_Crimson/A50': {
//     id: 'S:06fc20cb4ca7a06ff76a94b371b9c9ea58d73bbd,',
//     key: '06fc20cb4ca7a06ff76a94b371b9c9ea58d73bbd',
//   },
//   '_Global/_Chromatic/_Crimson/A100': {
//     id: 'S:d9cd036136c97257c1cddd0e533b7d3b02db1c97,',
//     key: 'd9cd036136c97257c1cddd0e533b7d3b02db1c97',
//   },
//   '_Global/_Chromatic/_Crimson/A200': {
//     id: 'S:82aa42fa899476d3b3464644a045a4b4d64d47ee,',
//     key: '82aa42fa899476d3b3464644a045a4b4d64d47ee',
//   },
//   '_Global/_Chromatic/_Cider/050': {
//     id: 'S:431eef3408fd29ad5396a032cff04f1305cb0e5f,',
//     key: '431eef3408fd29ad5396a032cff04f1305cb0e5f',
//   },
//   '_Global/_Chromatic/_Cider/100': {
//     id: 'S:a46ee11b8fc6abfea6c1598d43a7faa3a83d0ed0,',
//     key: 'a46ee11b8fc6abfea6c1598d43a7faa3a83d0ed0',
//   },
//   '_Global/_Chromatic/_Cider/200': {
//     id: 'S:0faba5e8f56c087d4df3b61fe95b9ec8c23b2313,',
//     key: '0faba5e8f56c087d4df3b61fe95b9ec8c23b2313',
//   },
//   '_Global/_Chromatic/_Cider/300': {
//     id: 'S:0a3e1d13c88453bf2f79eeda1f5c7f2b10e9a414,',
//     key: '0a3e1d13c88453bf2f79eeda1f5c7f2b10e9a414',
//   },
//   '_Global/_Chromatic/_Cider/400': {
//     id: 'S:a4d8b5ffbca1c9d932d808dea2c8d0015f713ddb,',
//     key: 'a4d8b5ffbca1c9d932d808dea2c8d0015f713ddb',
//   },
//   '_Global/_Chromatic/_Cider/500': {
//     id: 'S:af9bb477a996b85f8af14fb56e31d88b436105af,',
//     key: 'af9bb477a996b85f8af14fb56e31d88b436105af',
//   },
//   '_Global/_Chromatic/_Cider/600': {
//     id: 'S:a44420444da519dfc0a3ea4dcb46d01806ffaf38,',
//     key: 'a44420444da519dfc0a3ea4dcb46d01806ffaf38',
//   },
//   '_Global/_Chromatic/_Cider/700': {
//     id: 'S:74138b9540376edd1d619d2b8358b825c999e616,',
//     key: '74138b9540376edd1d619d2b8358b825c999e616',
//   },
//   '_Global/_Chromatic/_Cider/800': {
//     id: 'S:92ae1aa3ff58fe5de21292fc62efd7ad173ba81d,',
//     key: '92ae1aa3ff58fe5de21292fc62efd7ad173ba81d',
//   },
//   '_Global/_Chromatic/_Cider/900': {
//     id: 'S:b999e236690a89926bccc237e72476e2dfdfd1d2,',
//     key: 'b999e236690a89926bccc237e72476e2dfdfd1d2',
//   },
//   '_Global/_Chromatic/_Cider/950': {
//     id: 'S:981fee8505795b3541fee632d0289f4ffbfba969,',
//     key: '981fee8505795b3541fee632d0289f4ffbfba969',
//   },
//   '_Global/_Chromatic/_Cider/A00': {
//     id: 'S:061cfb22c706fe39492a285241c8c1da353a4f25,',
//     key: '061cfb22c706fe39492a285241c8c1da353a4f25',
//   },
//   '_Global/_Chromatic/_Cider/A50': {
//     id: 'S:335e7189be89293a86655b3db1aff67acd3a3c48,',
//     key: '335e7189be89293a86655b3db1aff67acd3a3c48',
//   },
//   '_Global/_Chromatic/_Cider/A100': {
//     id: 'S:77a6309357abd4824da84910a956984a094df05f,',
//     key: '77a6309357abd4824da84910a956984a094df05f',
//   },
//   '_Global/_Chromatic/_Cider/A200': {
//     id: 'S:af60ad5d135a9771fc5eec712d19d6d964d6e42b,',
//     key: 'af60ad5d135a9771fc5eec712d19d6d964d6e42b',
//   },
//   '_Global/_Chromatic/_Orchid/050': {
//     id: 'S:8d53d26fd2d68c9cccd549a3826d57d0a60db473,',
//     key: '8d53d26fd2d68c9cccd549a3826d57d0a60db473',
//   },
//   '_Global/_Chromatic/_Orchid/100': {
//     id: 'S:e8abbbafbcca4a39d143ea39bb9a7dd430a3dd16,',
//     key: 'e8abbbafbcca4a39d143ea39bb9a7dd430a3dd16',
//   },
//   '_Global/_Chromatic/_Orchid/200': {
//     id: 'S:445fe765116705e350bcd534627cb60494e2079b,',
//     key: '445fe765116705e350bcd534627cb60494e2079b',
//   },
//   '_Global/_Chromatic/_Orchid/300': {
//     id: 'S:10209b580ad741fd0669ddb6b73fc06edd705e5f,',
//     key: '10209b580ad741fd0669ddb6b73fc06edd705e5f',
//   },
//   '_Global/_Chromatic/_Orchid/400': {
//     id: 'S:ca0b80976e2b50a4cd16e4692743222344631e13,',
//     key: 'ca0b80976e2b50a4cd16e4692743222344631e13',
//   },
//   '_Global/_Chromatic/_Orchid/500': {
//     id: 'S:af3c75fd159c3c5d6471a5ea8d399bf920e38aa6,',
//     key: 'af3c75fd159c3c5d6471a5ea8d399bf920e38aa6',
//   },
//   '_Global/_Chromatic/_Orchid/600': {
//     id: 'S:b2f686d45d52627a802db364f4307da25dad6e91,',
//     key: 'b2f686d45d52627a802db364f4307da25dad6e91',
//   },
//   '_Global/_Chromatic/_Orchid/700': {
//     id: 'S:5a2ae91ea1acd103b416ba33843bf7008c4ccdf3,',
//     key: '5a2ae91ea1acd103b416ba33843bf7008c4ccdf3',
//   },
//   '_Global/_Chromatic/_Orchid/800': {
//     id: 'S:5d3c936ab6bed9efec977b8855abf0f1679ee9da,',
//     key: '5d3c936ab6bed9efec977b8855abf0f1679ee9da',
//   },
//   '_Global/_Chromatic/_Orchid/900': {
//     id: 'S:cba3615011d43d8421408375617bf06629295136,',
//     key: 'cba3615011d43d8421408375617bf06629295136',
//   },
//   '_Global/_Chromatic/_Orchid/950': {
//     id: 'S:1abd56ec91817641ff7c7d9ec74a1ec20a984937,',
//     key: '1abd56ec91817641ff7c7d9ec74a1ec20a984937',
//   },
//   '_Global/_Chromatic/_Orchid/A00': {
//     id: 'S:7c1094d00d9fa6ec7a5503a3a443ccab9b039771,',
//     key: '7c1094d00d9fa6ec7a5503a3a443ccab9b039771',
//   },
//   '_Global/_Chromatic/_Orchid/A50': {
//     id: 'S:2a3d2fc46b227a2b5c7793fffde9ac71949798b2,',
//     key: '2a3d2fc46b227a2b5c7793fffde9ac71949798b2',
//   },
//   '_Global/_Chromatic/_Orchid/A100': {
//     id: 'S:8f5210700bff3035ac4f21de896a70744317f904,',
//     key: '8f5210700bff3035ac4f21de896a70744317f904',
//   },
//   '_Global/_Chromatic/_Orchid/A200': {
//     id: 'S:4a641c2f813fc4608a700f96f5dbd8f5c06e7c72,',
//     key: '4a641c2f813fc4608a700f96f5dbd8f5c06e7c72',
//   },
//   '_Global/_Chromatic/_Magenta/050': {
//     id: 'S:1b93efa6b28a97f4dc0aee79f1f0c87a0fe32b00,',
//     key: '1b93efa6b28a97f4dc0aee79f1f0c87a0fe32b00',
//   },
//   '_Global/_Chromatic/_Magenta/100': {
//     id: 'S:793a2b3410586759fdb49bb86d694350d76e5c3b,',
//     key: '793a2b3410586759fdb49bb86d694350d76e5c3b',
//   },
//   '_Global/_Chromatic/_Magenta/200': {
//     id: 'S:7614f88c0e0a4cc2037eadde23f53ef811ad3f6d,',
//     key: '7614f88c0e0a4cc2037eadde23f53ef811ad3f6d',
//   },
//   '_Global/_Chromatic/_Magenta/300': {
//     id: 'S:2d81176120eb175370497dca839a81bd3c325167,',
//     key: '2d81176120eb175370497dca839a81bd3c325167',
//   },
//   '_Global/_Chromatic/_Magenta/400': {
//     id: 'S:5810748c1a40d96a0b147e3d49074f176418e074,',
//     key: '5810748c1a40d96a0b147e3d49074f176418e074',
//   },
//   '_Global/_Chromatic/_Magenta/500': {
//     id: 'S:b0a7ef1ca079374ecf34eebe4132738c0ea92fac,',
//     key: 'b0a7ef1ca079374ecf34eebe4132738c0ea92fac',
//   },
//   '_Global/_Chromatic/_Magenta/600': {
//     id: 'S:886ece5834e4a2cf282a31fefd9ff3847f493762,',
//     key: '886ece5834e4a2cf282a31fefd9ff3847f493762',
//   },
//   '_Global/_Chromatic/_Magenta/700': {
//     id: 'S:06e9e007397bb953cc3d871f613c5f39fd7a77d9,',
//     key: '06e9e007397bb953cc3d871f613c5f39fd7a77d9',
//   },
//   '_Global/_Chromatic/_Magenta/800': {
//     id: 'S:acc42838d31e6a0fb99eeb59b8c152dea7c39103,',
//     key: 'acc42838d31e6a0fb99eeb59b8c152dea7c39103',
//   },
//   '_Global/_Chromatic/_Magenta/900': {
//     id: 'S:edd4d63ad14622d3cacd4ea2f42ae9f08f2ce4fc,',
//     key: 'edd4d63ad14622d3cacd4ea2f42ae9f08f2ce4fc',
//   },
//   '_Global/_Chromatic/_Magenta/950': {
//     id: 'S:1494d75ebb6147878e46fe33b834d8a77954879a,',
//     key: '1494d75ebb6147878e46fe33b834d8a77954879a',
//   },
//   '_Global/_Chromatic/_Magenta/A00': {
//     id: 'S:18c8a04ee1702aa9b27e137f60349354fbef90e7,',
//     key: '18c8a04ee1702aa9b27e137f60349354fbef90e7',
//   },
//   '_Global/_Chromatic/_Magenta/A50': {
//     id: 'S:db2d0e9fe3d46198bb5ea4a08e4ee7406d40b18e,',
//     key: 'db2d0e9fe3d46198bb5ea4a08e4ee7406d40b18e',
//   },
//   '_Global/_Chromatic/_Magenta/A100': {
//     id: 'S:b1993e75f4e4e7a12bef3492db700be293e102bd,',
//     key: 'b1993e75f4e4e7a12bef3492db700be293e102bd',
//   },
//   '_Global/_Chromatic/_Magenta/A200': {
//     id: 'S:8a13aefe65d80c0b6d3c4d91e43e51a268fc5902,',
//     key: '8a13aefe65d80c0b6d3c4d91e43e51a268fc5902',
//   },
//   '_Global/_Chromatic/_Sapphire/050': {
//     id: 'S:f0622347bb8ac86665a07a8a01f0a09ce9eadada,',
//     key: 'f0622347bb8ac86665a07a8a01f0a09ce9eadada',
//   },
//   '_Global/_Chromatic/_Sapphire/100': {
//     id: 'S:c98eb360c69fa45dc4a415d4430d50b6a3c849e0,',
//     key: 'c98eb360c69fa45dc4a415d4430d50b6a3c849e0',
//   },
//   '_Global/_Chromatic/_Sapphire/200': {
//     id: 'S:7164f21ddceab19c4fa117e923a95a702131dfce,',
//     key: '7164f21ddceab19c4fa117e923a95a702131dfce',
//   },
//   '_Global/_Chromatic/_Sapphire/300': {
//     id: 'S:85e71398357c99528f81f26f0d62882364f3493b,',
//     key: '85e71398357c99528f81f26f0d62882364f3493b',
//   },
//   '_Global/_Chromatic/_Sapphire/400': {
//     id: 'S:044eb02566cf66b3a68dce36afc90273043c83d6,',
//     key: '044eb02566cf66b3a68dce36afc90273043c83d6',
//   },
//   '_Global/_Chromatic/_Sapphire/500': {
//     id: 'S:5732f2c797908c15e4890fc652901c6ba6bd9f03,',
//     key: '5732f2c797908c15e4890fc652901c6ba6bd9f03',
//   },
//   '_Global/_Chromatic/_Sapphire/600': {
//     id: 'S:15cb4d0a1aa9c88c54e2d5849ab957f2559175b5,',
//     key: '15cb4d0a1aa9c88c54e2d5849ab957f2559175b5',
//   },
//   '_Global/_Chromatic/_Sapphire/700': {
//     id: 'S:32d7999a4198a97d37c91c2d66897a03e4458ba3,',
//     key: '32d7999a4198a97d37c91c2d66897a03e4458ba3',
//   },
//   '_Global/_Chromatic/_Sapphire/800': {
//     id: 'S:288419b36274a450ad8796a9e2bec794bb2dc721,',
//     key: '288419b36274a450ad8796a9e2bec794bb2dc721',
//   },
//   '_Global/_Chromatic/_Sapphire/900': {
//     id: 'S:aa9a2459f761d8b293a70b533c14b34ee09d42b7,',
//     key: 'aa9a2459f761d8b293a70b533c14b34ee09d42b7',
//   },
//   '_Global/_Chromatic/_Sapphire/950': {
//     id: 'S:68cee21d875c08e019ec5deead12ae83188d08ee,',
//     key: '68cee21d875c08e019ec5deead12ae83188d08ee',
//   },
//   '_Global/_Chromatic/_Sapphire/A00': {
//     id: 'S:80dd900c10c8ec6a5deda66b055e6b39d10ad11e,',
//     key: '80dd900c10c8ec6a5deda66b055e6b39d10ad11e',
//   },
//   '_Global/_Chromatic/_Sapphire/A50': {
//     id: 'S:d5b35f4b3e2b4dd0d7abb1a1bb568fea686b38a3,',
//     key: 'd5b35f4b3e2b4dd0d7abb1a1bb568fea686b38a3',
//   },
//   '_Global/_Chromatic/_Sapphire/A100': {
//     id: 'S:66ac683c4f86ee8acc4e6ecf20a90a8dd14ffb48,',
//     key: '66ac683c4f86ee8acc4e6ecf20a90a8dd14ffb48',
//   },
//   '_Global/_Chromatic/_Sapphire/A200': {
//     id: 'S:221c4e7facc3778185d6cd4ca9bfbe2bee5e433e,',
//     key: '221c4e7facc3778185d6cd4ca9bfbe2bee5e433e',
//   },
//   '_Global/_Neutrals/_blueGrayLight/000': {
//     id: 'S:6fc94d5d58ea0b77520289829ca860ff01c68349,',
//     key: '6fc94d5d58ea0b77520289829ca860ff01c68349',
//   },
//   '_Global/_Neutrals/_blueGrayLight/050': {
//     id: 'S:bd5c366f5a8d4d88e956c9c98bd30e25922313c3,',
//     key: 'bd5c366f5a8d4d88e956c9c98bd30e25922313c3',
//   },
//   '_Global/_Neutrals/_blueGrayLight/100': {
//     id: 'S:631f45d3322bea0f9277eae9ceaa374d34f5f70b,',
//     key: '631f45d3322bea0f9277eae9ceaa374d34f5f70b',
//   },
//   '_Global/_Neutrals/_blueGrayLight/200': {
//     id: 'S:7458f342eb6d092a4362e81acdcd9feb70284347,',
//     key: '7458f342eb6d092a4362e81acdcd9feb70284347',
//   },
//   '_Global/_Neutrals/_blueGrayLight/300': {
//     id: 'S:71742d7b4c418f6b188c97ce6076281e35e421f8,',
//     key: '71742d7b4c418f6b188c97ce6076281e35e421f8',
//   },
//   '_Global/_Neutrals/_blueGrayLight/400': {
//     id: 'S:f690d5d18d96c47965040bfd05e38bf0985145e9,',
//     key: 'f690d5d18d96c47965040bfd05e38bf0985145e9',
//   },
//   '_Global/_Neutrals/_blueGrayLight/500': {
//     id: 'S:9eb62ccab1c62bccbbf660a976014111f85c5bc3,',
//     key: '9eb62ccab1c62bccbbf660a976014111f85c5bc3',
//   },
//   '_Global/_Neutrals/_blueGrayLight/600': {
//     id: 'S:69d74672a63070a3ab1b8195d502ab37d8fb2428,',
//     key: '69d74672a63070a3ab1b8195d502ab37d8fb2428',
//   },
//   '_Global/_Neutrals/_blueGrayLight/700': {
//     id: 'S:ef50642a70b0fa89a6c1c1a31a7302493fa77981,',
//     key: 'ef50642a70b0fa89a6c1c1a31a7302493fa77981',
//   },
//   '_Global/_Neutrals/_blueGrayLight/800': {
//     id: 'S:91cf239d4ac9ee70fe74f8d73a2d58448a059144,',
//     key: '91cf239d4ac9ee70fe74f8d73a2d58448a059144',
//   },
//   '_Global/_Neutrals/_blueGrayLight/900': {
//     id: 'S:e34b8e4f1bad0b9c0ec96c6b7dd3cc0f5b3e80ff,',
//     key: 'e34b8e4f1bad0b9c0ec96c6b7dd3cc0f5b3e80ff',
//   },
//   '_Global/_Neutrals/_blueGrayLight/1000': {
//     id: 'S:b6eacd14621a2884e99ae227e48bae6d029fe15c,',
//     key: 'b6eacd14621a2884e99ae227e48bae6d029fe15c',
//   },
//   '_Global/_Neutrals/_blueGrayLight/1100': {
//     id: 'S:0704fc8cddba0848bf399b32bbe72996c66f8fa4,',
//     key: '0704fc8cddba0848bf399b32bbe72996c66f8fa4',
//   },
//   '_Global/_Neutrals/_blueGrayLight/1200': {
//     id: 'S:0f327de549b9fa2091c73b4d73089af6d2f9dae2,',
//     key: '0f327de549b9fa2091c73b4d73089af6d2f9dae2',
//   },
//   '_Global/_Neutrals/_blueGrayLight/1300': {
//     id: 'S:79bcb0f063e61e9a5cf2fcb1ba9074404cac0a35,',
//     key: '79bcb0f063e61e9a5cf2fcb1ba9074404cac0a35',
//   },
//   '_Global/_Neutrals/_blueGrayLight/A00': {
//     id: 'S:2ec5c1ec9b7a05d475aadbb3afac0a57884b777f,',
//     key: '2ec5c1ec9b7a05d475aadbb3afac0a57884b777f',
//   },
//   '_Global/_Neutrals/_blueGrayLight/A50': {
//     id: 'S:a7e2315feb3c1a1db8a29c67b62dae85cd3b4dd6,',
//     key: 'a7e2315feb3c1a1db8a29c67b62dae85cd3b4dd6',
//   },
//   '_Global/_Neutrals/_blueGrayLight/A100': {
//     id: 'S:133cf38f28913725b8eef1d89ed10cbed5127234,',
//     key: '133cf38f28913725b8eef1d89ed10cbed5127234',
//   },
//   '_Global/_Neutrals/_blueGrayLight/A200': {
//     id: 'S:adf638ed10306c9660a063fa170a595e94a05c1f,',
//     key: 'adf638ed10306c9660a063fa170a595e94a05c1f',
//   },
//   '_Global/_Neutrals/_blueGrayLight/a300': {
//     id: 'S:22741b704f43c0836cbb945262ac1db887f1cb0d,',
//     key: '22741b704f43c0836cbb945262ac1db887f1cb0d',
//   },
//   '_Global/_Neutrals/_blueGrayLight/a400': {
//     id: 'S:d2fc9a70c26d7a2baf78c4ec9ffec12189dc53d9,',
//     key: 'd2fc9a70c26d7a2baf78c4ec9ffec12189dc53d9',
//   },
//   '_Global / _Neutrals / _blueGrayLight / a500': {
//     id: 'S:72e63903a64534fd8eadfe987b1b757bf0938caf,',
//     key: '72e63903a64534fd8eadfe987b1b757bf0938caf',
//   },
//   '_Global/_Neutrals/_blueGrayDark/000': {
//     id: 'S:9e85207435b208efde8bca3581d70f0ed0e24d5d,',
//     key: '9e85207435b208efde8bca3581d70f0ed0e24d5d',
//   },
//   '_Global/_Neutrals/_blueGrayDark/050': {
//     id: 'S:86d8f7eca52f4bbc5975f7b0a00adec34a95c965,',
//     key: '86d8f7eca52f4bbc5975f7b0a00adec34a95c965',
//   },
//   '_Global/_Neutrals/_blueGrayDark/100': {
//     id: 'S:3d14d63fbea4c3b6b9f417536504900c27059f6f,',
//     key: '3d14d63fbea4c3b6b9f417536504900c27059f6f',
//   },
//   '_Global/_Neutrals/_blueGrayDark/200': {
//     id: 'S:cac05095501d9d82ccfe0fc22ebda7ffbe72b48d,',
//     key: 'cac05095501d9d82ccfe0fc22ebda7ffbe72b48d',
//   },
//   '_Global/_Neutrals/_blueGrayDark/300': {
//     id: 'S:888ffa71b95e84985cc958922d49b65540f6a094,',
//     key: '888ffa71b95e84985cc958922d49b65540f6a094',
//   },
//   '_Global/_Neutrals/_blueGrayDark/400': {
//     id: 'S:8c1fa85d63641a749ddd27ad208749df092035d1,',
//     key: '8c1fa85d63641a749ddd27ad208749df092035d1',
//   },
//   '_Global/_Neutrals/_blueGrayDark/500': {
//     id: 'S:b7ce7c35dc0c62a83acf1fd061fb8424b65f18e8,',
//     key: 'b7ce7c35dc0c62a83acf1fd061fb8424b65f18e8',
//   },
//   '_Global/_Neutrals/_blueGrayDark/600': {
//     id: 'S:6911861ed034843691d5c8a429b14171b77a1a0f,',
//     key: '6911861ed034843691d5c8a429b14171b77a1a0f',
//   },
//   '_Global/_Neutrals/_blueGrayDark/700': {
//     id: 'S:104741ac424dab7b13f1bae1282bcb7144601d6d,',
//     key: '104741ac424dab7b13f1bae1282bcb7144601d6d',
//   },
//   '_Global/_Neutrals/_blueGrayDark/800': {
//     id: 'S:eb626b1def860093fd6405cdf7a7578ddadb1af6,',
//     key: 'eb626b1def860093fd6405cdf7a7578ddadb1af6',
//   },
//   '_Global/_Neutrals/_blueGrayDark/900': {
//     id: 'S:f36a2574fde9ceea017e7c91a7ab36157a5696f4,',
//     key: 'f36a2574fde9ceea017e7c91a7ab36157a5696f4',
//   },
//   '_Global/_Neutrals/_blueGrayDark/1000': {
//     id: 'S:4a341abd06059be3a92942fba6419eb9a595ad14,',
//     key: '4a341abd06059be3a92942fba6419eb9a595ad14',
//   },
//   '_Global/_Neutrals/_blueGrayDark/1100': {
//     id: 'S:2a068b7aa337c960523c933e2adce56a11f10650,',
//     key: '2a068b7aa337c960523c933e2adce56a11f10650',
//   },
//   '_Global/_Neutrals/_blueGrayDark/1200': {
//     id: 'S:109ec08bbb90b183aa8343b9d2ec73c135b53f10,',
//     key: '109ec08bbb90b183aa8343b9d2ec73c135b53f10',
//   },
//   '_Global/_Neutrals/_blueGrayDark/1300': {
//     id: 'S:6dbdc07eff6ddfe403915d2e685d761ab17c57e2,',
//     key: '6dbdc07eff6ddfe403915d2e685d761ab17c57e2',
//   },
//   '_Global/_Neutrals/_blueGrayDark/A00': {
//     id: 'S:500ce50b676afa97c09e8f5c0816eccbbcc2d360,',
//     key: '500ce50b676afa97c09e8f5c0816eccbbcc2d360',
//   },
//   '_Global/_Neutrals/_blueGrayDark/A50': {
//     id: 'S:9f5a8cc2dad3b3c1f5bde8bf11ac6b4a18bb39e1,',
//     key: '9f5a8cc2dad3b3c1f5bde8bf11ac6b4a18bb39e1',
//   },
//   '_Global/_Neutrals/_blueGrayDark/A100': {
//     id: 'S:648631a9a0acc09ee6e83e2bc62b6fd848e38f53,',
//     key: '648631a9a0acc09ee6e83e2bc62b6fd848e38f53',
//   },
//   '_Global/_Neutrals/_blueGrayDark/A200': {
//     id: 'S:b15389614c3f9c97d165d8f84ab95f0cffffac5f,',
//     key: 'b15389614c3f9c97d165d8f84ab95f0cffffac5f',
//   },
//   '_Global/_Neutrals/_blueGrayDark/a300': {
//     id: 'S:2079506d08bae6658204b9f54c66858e4764f0a9,',
//     key: '2079506d08bae6658204b9f54c66858e4764f0a9',
//   },
//   '_Global/_Neutrals/_blueGrayDark/a400': {
//     id: 'S:6bd4f1ab743fd1732347303add5faf7a08375107,',
//     key: '6bd4f1ab743fd1732347303add5faf7a08375107',
//   },
//   '_Global / _Neutrals / _blueGrayDark / a500': {
//     id: 'S:f1e77980cd648ed73a0530296635378aa484af61,',
//     key: 'f1e77980cd648ed73a0530296635378aa484af61',
//   },
//   '_Global/_Neutrals/_navyGrayLight/000': {
//     id: 'S:336b7c873e079f8cbae7b889cac474ac2c95e377,',
//     key: '336b7c873e079f8cbae7b889cac474ac2c95e377',
//   },
//   '_Global/_Neutrals/_navyGrayLight/050': {
//     id: 'S:39d47fa20be9c1cf1b5ecaae7160f56d2cb891ff,',
//     key: '39d47fa20be9c1cf1b5ecaae7160f56d2cb891ff',
//   },
//   '_Global/_Neutrals/_navyGrayLight/100': {
//     id: 'S:89c7cb0ba9f2cbdf5660d881fe956d9c9b153ef9,',
//     key: '89c7cb0ba9f2cbdf5660d881fe956d9c9b153ef9',
//   },
//   '_Global/_Neutrals/_navyGrayLight/200': {
//     id: 'S:6039182798f3f6e8f09dd8ec9c9f0bb1eef34d71,',
//     key: '6039182798f3f6e8f09dd8ec9c9f0bb1eef34d71',
//   },
//   '_Global/_Neutrals/_navyGrayLight/300': {
//     id: 'S:0c231657c73179ea9c589083cc9a85c3e8c2c851,',
//     key: '0c231657c73179ea9c589083cc9a85c3e8c2c851',
//   },
//   '_Global/_Neutrals/_navyGrayLight/400': {
//     id: 'S:62922d53d521fe54fc7ce71d81ba4db23eedbf95,',
//     key: '62922d53d521fe54fc7ce71d81ba4db23eedbf95',
//   },
//   '_Global/_Neutrals/_navyGrayLight/500': {
//     id: 'S:53ee12a6529770a919195aa4ce3237611102b56f,',
//     key: '53ee12a6529770a919195aa4ce3237611102b56f',
//   },
//   '_Global/_Neutrals/_navyGrayLight/600': {
//     id: 'S:85fe2e7fbb1f8f8726aa4e44759af4b3b879ad04,',
//     key: '85fe2e7fbb1f8f8726aa4e44759af4b3b879ad04',
//   },
//   '_Global/_Neutrals/_navyGrayLight/700': {
//     id: 'S:2e070f5ab6cf12f2ee4b6fcbc8064af4fc57c0bb,',
//     key: '2e070f5ab6cf12f2ee4b6fcbc8064af4fc57c0bb',
//   },
//   '_Global/_Neutrals/_navyGrayLight/800': {
//     id: 'S:ca057e021b007086875fdf7a8b5beb300c7d19f2,',
//     key: 'ca057e021b007086875fdf7a8b5beb300c7d19f2',
//   },
//   '_Global/_Neutrals/_navyGrayLight/900': {
//     id: 'S:4abe16be2190241ea1cb6dcb7e8aebd03b77408e,',
//     key: '4abe16be2190241ea1cb6dcb7e8aebd03b77408e',
//   },
//   '_Global/_Neutrals/_navyGrayLight/1000': {
//     id: 'S:67ff15b80b7d675fa098b6a9485e617ff858bb4f,',
//     key: '67ff15b80b7d675fa098b6a9485e617ff858bb4f',
//   },
//   '_Global/_Neutrals/_navyGrayLight/1100': {
//     id: 'S:3b9d7f10dc00fca458ccb120b8a47ae2ca44e6d8,',
//     key: '3b9d7f10dc00fca458ccb120b8a47ae2ca44e6d8',
//   },
//   '_Global/_Neutrals/_navyGrayLight/1200': {
//     id: 'S:8af2025625a9238c3dac508bbb4d7923f5bd9c29,',
//     key: '8af2025625a9238c3dac508bbb4d7923f5bd9c29',
//   },
//   '_Global/_Neutrals/_navyGrayLight/1300': {
//     id: 'S:31511938c9a7477b1cdd840c4b7378a2e1c6f632,',
//     key: '31511938c9a7477b1cdd840c4b7378a2e1c6f632',
//   },
//   '_Global/_Neutrals/_navyGrayLight/A00': {
//     id: 'S:8003d2700e5a7b4063ed36aa2ce6c5c2179dff18,',
//     key: '8003d2700e5a7b4063ed36aa2ce6c5c2179dff18',
//   },
//   '_Global/_Neutrals/_navyGrayLight/A50': {
//     id: 'S:a62a085e6782f822c633c4aa5504aa627db61897,',
//     key: 'a62a085e6782f822c633c4aa5504aa627db61897',
//   },
//   '_Global/_Neutrals/_navyGrayLight/A100': {
//     id: 'S:f48393c5c092cf4960f101f457752f89e10a3c1d,',
//     key: 'f48393c5c092cf4960f101f457752f89e10a3c1d',
//   },
//   '_Global/_Neutrals/_navyGrayLight/A200': {
//     id: 'S:7cff0a213e5e62e705fa9a961498825be1eb08f2,',
//     key: '7cff0a213e5e62e705fa9a961498825be1eb08f2',
//   },
//   '_Global/_Neutrals/_navyGrayLight/a300': {
//     id: 'S:19b8bbccfa73bc0b4b116b9c2a71b45cda0c99d5,',
//     key: '19b8bbccfa73bc0b4b116b9c2a71b45cda0c99d5',
//   },
//   '_Global/_Neutrals/_navyGrayLight/a400': {
//     id: 'S:18c4574360f22cb2553c2c5597d137b417808b01,',
//     key: '18c4574360f22cb2553c2c5597d137b417808b01',
//   },
//   '_Global / _Neutrals / _navyGrayLight / a500': {
//     id: 'S:5ba50850294d9afa6d9b5a9021216cf26a448cae,',
//     key: '5ba50850294d9afa6d9b5a9021216cf26a448cae',
//   },
//   '_Global/_Neutrals/_navyGrayDark/000': {
//     id: 'S:91e7d1c46f47f5f336814ae076b70d6cdb54f7e3,',
//     key: '91e7d1c46f47f5f336814ae076b70d6cdb54f7e3',
//   },
//   '_Global/_Neutrals/_navyGrayDark/050': {
//     id: 'S:4b8283dd7dac9960108224506f5d66a67af2cb4d,',
//     key: '4b8283dd7dac9960108224506f5d66a67af2cb4d',
//   },
//   '_Global/_Neutrals/_navyGrayDark/100': {
//     id: 'S:c0c1e1d2bdf936ff91f28c60312103ed078c0950,',
//     key: 'c0c1e1d2bdf936ff91f28c60312103ed078c0950',
//   },
//   '_Global/_Neutrals/_navyGrayDark/200': {
//     id: 'S:b62919b8e5eaf1c62d74aea0273359da63d872d7,',
//     key: 'b62919b8e5eaf1c62d74aea0273359da63d872d7',
//   },
//   '_Global/_Neutrals/_navyGrayDark/300': {
//     id: 'S:a859c74ad03e1a4ef56cf18ced38b77437e3e2cd,',
//     key: 'a859c74ad03e1a4ef56cf18ced38b77437e3e2cd',
//   },
//   '_Global/_Neutrals/_navyGrayDark/400': {
//     id: 'S:535f4d8270e0fa9e56726a5daa2fd80614e29c18,',
//     key: '535f4d8270e0fa9e56726a5daa2fd80614e29c18',
//   },
//   '_Global/_Neutrals/_navyGrayDark/500': {
//     id: 'S:e02f0be4435837a463d86ccd77e5f3eef14fce9e,',
//     key: 'e02f0be4435837a463d86ccd77e5f3eef14fce9e',
//   },
//   '_Global/_Neutrals/_navyGrayDark/600': {
//     id: 'S:13544c7572611f39d74dc838104e593d4a1b385a,',
//     key: '13544c7572611f39d74dc838104e593d4a1b385a',
//   },
//   '_Global/_Neutrals/_navyGrayDark/700': {
//     id: 'S:39e65b637fc160f07fc891e0cdd818ad6af7c0bc,',
//     key: '39e65b637fc160f07fc891e0cdd818ad6af7c0bc',
//   },
//   '_Global/_Neutrals/_navyGrayDark/800': {
//     id: 'S:5d9626fed4ec32d460508f45b8ad790682d427c5,',
//     key: '5d9626fed4ec32d460508f45b8ad790682d427c5',
//   },
//   '_Global/_Neutrals/_navyGrayDark/900': {
//     id: 'S:4dc0ea9d79ecfbd6f8ba1c010dde8e9e06cfaa08,',
//     key: '4dc0ea9d79ecfbd6f8ba1c010dde8e9e06cfaa08',
//   },
//   '_Global/_Neutrals/_navyGrayDark/1000': {
//     id: 'S:9dc62256ac2aff3dc9040414b4408cffc94a305f,',
//     key: '9dc62256ac2aff3dc9040414b4408cffc94a305f',
//   },
//   '_Global/_Neutrals/_navyGrayDark/1100': {
//     id: 'S:9a7f31a0241c6c55b9f4aa065569c4c97fc23dc1,',
//     key: '9a7f31a0241c6c55b9f4aa065569c4c97fc23dc1',
//   },
//   '_Global/_Neutrals/_navyGrayDark/1200': {
//     id: 'S:7b2a80ceda8bb206a2809c27a59656c5db53fa1b,',
//     key: '7b2a80ceda8bb206a2809c27a59656c5db53fa1b',
//   },
//   '_Global/_Neutrals/_navyGrayDark/1300': {
//     id: 'S:071ff7d18f938f28f31939153a40949b79fe4243,',
//     key: '071ff7d18f938f28f31939153a40949b79fe4243',
//   },
//   '_Global/_Neutrals/_navyGrayDark/A00': {
//     id: 'S:30fe7a4381f4ab626c008a324e0b2572df4bad65,',
//     key: '30fe7a4381f4ab626c008a324e0b2572df4bad65',
//   },
//   '_Global/_Neutrals/_navyGrayDark/A50': {
//     id: 'S:cfa9570de4d7401c1afa4c128fcaa9d759bfda4c,',
//     key: 'cfa9570de4d7401c1afa4c128fcaa9d759bfda4c',
//   },
//   '_Global/_Neutrals/_navyGrayDark/A100': {
//     id: 'S:cd2855f5ef15872708948d767ec7d1cd6a66e593,',
//     key: 'cd2855f5ef15872708948d767ec7d1cd6a66e593',
//   },
//   '_Global/_Neutrals/_navyGrayDark/A200': {
//     id: 'S:b08b6b86ac2458181fd14fcc38f32c02f7f9e2bd,',
//     key: 'b08b6b86ac2458181fd14fcc38f32c02f7f9e2bd',
//   },
//   '_Global/_Neutrals/_navyGrayDark/a300': {
//     id: 'S:ac27acbe75e48f93a488faf89dd85d995e8e923c,',
//     key: 'ac27acbe75e48f93a488faf89dd85d995e8e923c',
//   },
//   '_Global/_Neutrals/_navyGrayDark/a400': {
//     id: 'S:962c0cad544b33c358a5514c01d9210c8d09b190,',
//     key: '962c0cad544b33c358a5514c01d9210c8d09b190',
//   },
//   '_Global / _Neutrals / _navyGrayDark / a500': {
//     id: 'S:f14be6657ec15cdb86526a9e7e1c13ce60dcadd8,',
//     key: 'f14be6657ec15cdb86526a9e7e1c13ce60dcadd8',
//   },
//   '_Global/_Neutrals/_ashGrayLight/000': {
//     id: 'S:d7f040854839d095084cdb288abc76cf9c035ea9,',
//     key: 'd7f040854839d095084cdb288abc76cf9c035ea9',
//   },
//   '_Global/_Neutrals/_ashGrayLight/050': {
//     id: 'S:fb08d50134ce10150856b33ae7b57d529d5ba055,',
//     key: 'fb08d50134ce10150856b33ae7b57d529d5ba055',
//   },
//   '_Global/_Neutrals/_ashGrayLight/100': {
//     id: 'S:a60ef256e4a9828f01fc204314f224d726e81f6b,',
//     key: 'a60ef256e4a9828f01fc204314f224d726e81f6b',
//   },
//   '_Global/_Neutrals/_ashGrayLight/200': {
//     id: 'S:696b87ce309affaf1311efbd5b8dfb800d4cc3fd,',
//     key: '696b87ce309affaf1311efbd5b8dfb800d4cc3fd',
//   },
//   '_Global/_Neutrals/_ashGrayLight/300': {
//     id: 'S:f4ee300918b0a4155c93886d5e660e20337c015f,',
//     key: 'f4ee300918b0a4155c93886d5e660e20337c015f',
//   },
//   '_Global/_Neutrals/_ashGrayLight/400': {
//     id: 'S:cb30a87fb590be1a306d08d6877ef8dac6478da4,',
//     key: 'cb30a87fb590be1a306d08d6877ef8dac6478da4',
//   },
//   '_Global/_Neutrals/_ashGrayLight/500': {
//     id: 'S:6fa02387b3be10166952dff11a0e9b684069e20e,',
//     key: '6fa02387b3be10166952dff11a0e9b684069e20e',
//   },
//   '_Global/_Neutrals/_ashGrayLight/600': {
//     id: 'S:f053b969beed749eb51050ea6f8b0e57a04ae6fb,',
//     key: 'f053b969beed749eb51050ea6f8b0e57a04ae6fb',
//   },
//   '_Global/_Neutrals/_ashGrayLight/700': {
//     id: 'S:573a1d6798559d5d3d8a4727777ff0207df11f15,',
//     key: '573a1d6798559d5d3d8a4727777ff0207df11f15',
//   },
//   '_Global/_Neutrals/_ashGrayLight/800': {
//     id: 'S:ab92a02c6ad61b00af6969f63ee09a978bdc45c3,',
//     key: 'ab92a02c6ad61b00af6969f63ee09a978bdc45c3',
//   },
//   '_Global/_Neutrals/_ashGrayLight/900': {
//     id: 'S:81289133f5d5309667896977399b3c9b04a0b2df,',
//     key: '81289133f5d5309667896977399b3c9b04a0b2df',
//   },
//   '_Global/_Neutrals/_ashGrayLight/1000': {
//     id: 'S:f8e891c0cfcf9b7d87b5a29c6073bbd8ba14386d,',
//     key: 'f8e891c0cfcf9b7d87b5a29c6073bbd8ba14386d',
//   },
//   '_Global/_Neutrals/_ashGrayLight/1100': {
//     id: 'S:7f25d150284caa3ac7a316868b24b8973c1e7de8,',
//     key: '7f25d150284caa3ac7a316868b24b8973c1e7de8',
//   },
//   '_Global/_Neutrals/_ashGrayLight/1200': {
//     id: 'S:87edfe6504f6192b67e25c69d034524541531ea3,',
//     key: '87edfe6504f6192b67e25c69d034524541531ea3',
//   },
//   '_Global/_Neutrals/_ashGrayLight/1300': {
//     id: 'S:4607dfe905ff16f4b9410db0e703b1d7d6c79027,',
//     key: '4607dfe905ff16f4b9410db0e703b1d7d6c79027',
//   },
//   '_Global/_Neutrals/_ashGrayLight/A00': {
//     id: 'S:c89d66c52d07149548907c1aa144c2d77d21edaa,',
//     key: 'c89d66c52d07149548907c1aa144c2d77d21edaa',
//   },
//   '_Global/_Neutrals/_ashGrayLight/A50': {
//     id: 'S:ff2c1d78a3b97d60f9fed19918eb258dd0765872,',
//     key: 'ff2c1d78a3b97d60f9fed19918eb258dd0765872',
//   },
//   '_Global/_Neutrals/_ashGrayLight/A100': {
//     id: 'S:10213b87338a79122fce6b715760f7307e4d1001,',
//     key: '10213b87338a79122fce6b715760f7307e4d1001',
//   },
//   '_Global/_Neutrals/_ashGrayLight/A200': {
//     id: 'S:7bd09c9cb36e480b4871c0bdf19b6b702465a398,',
//     key: '7bd09c9cb36e480b4871c0bdf19b6b702465a398',
//   },
//   '_Global/_Neutrals/_ashGrayLight/a300': {
//     id: 'S:bb692663039559c86f8cba7fb04851400731b92d,',
//     key: 'bb692663039559c86f8cba7fb04851400731b92d',
//   },
//   '_Global/_Neutrals/_ashGrayLight/a400': {
//     id: 'S:26eb5cf91743f2bc4871e9bdad63f5cad29dd454,',
//     key: '26eb5cf91743f2bc4871e9bdad63f5cad29dd454',
//   },
//   '_Global / _Neutrals / _ashGrayLight / a500': {
//     id: 'S:f46bc1a215a799f5ff6495afa27ef2121e4faf33,',
//     key: 'f46bc1a215a799f5ff6495afa27ef2121e4faf33',
//   },
//   '_Global/_Neutrals/_ashGrayDark/000': {
//     id: 'S:9336eff41b848ed572da09cb724d5c1004d90c70,',
//     key: '9336eff41b848ed572da09cb724d5c1004d90c70',
//   },
//   '_Global/_Neutrals/_ashGrayDark/050': {
//     id: 'S:0c16256ef60dbe56041063280462f8306da37a13,',
//     key: '0c16256ef60dbe56041063280462f8306da37a13',
//   },
//   '_Global/_Neutrals/_ashGrayDark/100': {
//     id: 'S:eec89fd048f7ee7aa4a256bd284f12c0345839be,',
//     key: 'eec89fd048f7ee7aa4a256bd284f12c0345839be',
//   },
//   '_Global/_Neutrals/_ashGrayDark/200': {
//     id: 'S:57b7cb4e02ee5b16b9f8c50985a26642de5c4959,',
//     key: '57b7cb4e02ee5b16b9f8c50985a26642de5c4959',
//   },
//   '_Global/_Neutrals/_ashGrayDark/300': {
//     id: 'S:664fd3dcc19b72f4acff5f8941c4175b62832264,',
//     key: '664fd3dcc19b72f4acff5f8941c4175b62832264',
//   },
//   '_Global/_Neutrals/_ashGrayDark/400': {
//     id: 'S:e5b19188d045b403c4318a707f1960e8c116d677,',
//     key: 'e5b19188d045b403c4318a707f1960e8c116d677',
//   },
//   '_Global/_Neutrals/_ashGrayDark/500': {
//     id: 'S:1b3b5835541111cbc86831dbab1df7c7fc2c959a,',
//     key: '1b3b5835541111cbc86831dbab1df7c7fc2c959a',
//   },
//   '_Global/_Neutrals/_ashGrayDark/600': {
//     id: 'S:931ec7170c8991a5db017a593acea41630c04242,',
//     key: '931ec7170c8991a5db017a593acea41630c04242',
//   },
//   '_Global/_Neutrals/_ashGrayDark/700': {
//     id: 'S:37b02636468952ba5cc43cf4a699c130a076ab97,',
//     key: '37b02636468952ba5cc43cf4a699c130a076ab97',
//   },
//   '_Global/_Neutrals/_ashGrayDark/800': {
//     id: 'S:5ee803f4cf1584b865873f34b14b4fae7f5d835f,',
//     key: '5ee803f4cf1584b865873f34b14b4fae7f5d835f',
//   },
//   '_Global/_Neutrals/_ashGrayDark/900': {
//     id: 'S:5350d67cc2cf0ed083c6e82b59474dda9a27edf6,',
//     key: '5350d67cc2cf0ed083c6e82b59474dda9a27edf6',
//   },
//   '_Global/_Neutrals/_ashGrayDark/1000': {
//     id: 'S:99b1a572cd39ec2ba256aaf107e366b13e2bdc1e,',
//     key: '99b1a572cd39ec2ba256aaf107e366b13e2bdc1e',
//   },
//   '_Global/_Neutrals/_ashGrayDark/1100': {
//     id: 'S:c0d1bb5630564a89a30e8129a6647982aa76798d,',
//     key: 'c0d1bb5630564a89a30e8129a6647982aa76798d',
//   },
//   '_Global/_Neutrals/_ashGrayDark/1200': {
//     id: 'S:60f6bab7349ef009f587972878b3e0d0bd5f76d6,',
//     key: '60f6bab7349ef009f587972878b3e0d0bd5f76d6',
//   },
//   '_Global/_Neutrals/_ashGrayDark/1300': {
//     id: 'S:d0a4fb142114c114e678291bc2bdd1618a90efad,',
//     key: 'd0a4fb142114c114e678291bc2bdd1618a90efad',
//   },
//   '_Global/_Neutrals/_ashGrayDark/A00': {
//     id: 'S:b333fa0c49de33cda0bb0d5ad16d66383cfde2ea,',
//     key: 'b333fa0c49de33cda0bb0d5ad16d66383cfde2ea',
//   },
//   '_Global/_Neutrals/_ashGrayDark/A50': {
//     id: 'S:40f9474f6f446d3f0598234f6ede5d7ce895792e,',
//     key: '40f9474f6f446d3f0598234f6ede5d7ce895792e',
//   },
//   '_Global/_Neutrals/_ashGrayDark/A100': {
//     id: 'S:4234e852f771aaf16fa74733cb490c88383f649d,',
//     key: '4234e852f771aaf16fa74733cb490c88383f649d',
//   },
//   '_Global/_Neutrals/_ashGrayDark/A200': {
//     id: 'S:91c2f41754b003219a8f4ee3748b7b2f2eeae296,',
//     key: '91c2f41754b003219a8f4ee3748b7b2f2eeae296',
//   },
//   '_Global/_Neutrals/_ashGrayDark/a300': {
//     id: 'S:afdcfd5cc727a1588812a609732a6b2a6a635ca8,',
//     key: 'afdcfd5cc727a1588812a609732a6b2a6a635ca8',
//   },
//   '_Global/_Neutrals/_ashGrayDark/a400': {
//     id: 'S:87f1f745d5037af4380a1c290f5a08f1c026932b,',
//     key: '87f1f745d5037af4380a1c290f5a08f1c026932b',
//   },
//   '_Global / _Neutrals / _ashGrayDark / a500': {
//     id: 'S:599812096913fc912dcfbbf78e5a7440aabbed56,',
//     key: '599812096913fc912dcfbbf78e5a7440aabbed56',
//   },
//   'Surface/Background/Level1/lowContrast': {
//     id: 'S:1c1b46f5307be0e505c423ad4f12cd0c1417e0c8,',
//     key: '1c1b46f5307be0e505c423ad4f12cd0c1417e0c8',
//   },
//   'Surface/Background/Level1/highContrast': {
//     id: 'S:f22cd223d4c3ceb0fabf5473f27d503efdbacbc6,',
//     key: 'f22cd223d4c3ceb0fabf5473f27d503efdbacbc6',
//   },
//   'Surface/Background/Level2/lowContrast': {
//     id: 'S:491971a3a3b3bd62c4331eaee59d730cbae4dab3,',
//     key: '491971a3a3b3bd62c4331eaee59d730cbae4dab3',
//   },
//   'Surface/Background/Level2/highContrast': {
//     id: 'S:3e339d9a213f131a56963e82d1253a2f6146eed4,',
//     key: '3e339d9a213f131a56963e82d1253a2f6146eed4',
//   },
//   'Surface/Background/Level3/lowContrast': {
//     id: 'S:50d7b7d329e8b6bb370bbd111b503972b5338a46,',
//     key: '50d7b7d329e8b6bb370bbd111b503972b5338a46',
//   },
//   'Surface/Background/Level3/highContrast': {
//     id: 'S:51c1b9a486d89b39dba7b71e1d305eefb338c74d,',
//     key: '51c1b9a486d89b39dba7b71e1d305eefb338c74d',
//   },
//   'Surface/Border/Normal/lowContrast': {
//     id: 'S:37c9c56032c685ddcea68c48394ee0b05e2a00e5,',
//     key: '37c9c56032c685ddcea68c48394ee0b05e2a00e5',
//   },
//   'Surface/Border/Normal/highContrast': {
//     id: 'S:08aea19f00f91ac9acfa622a8b94919589a875b0,',
//     key: '08aea19f00f91ac9acfa622a8b94919589a875b0',
//   },
//   'Surface/Border/Subtle/lowContrast': {
//     id: 'S:dc1708f439cb8f9838906051d655661b7daf1689,',
//     key: 'dc1708f439cb8f9838906051d655661b7daf1689',
//   },
//   'Surface/Border/Subtle/highContrast': {
//     id: 'S:62e462194081a1a0cf7ab9a32cbf909d0d0f41a5,',
//     key: '62e462194081a1a0cf7ab9a32cbf909d0d0f41a5',
//   },
//   'Surface/Text/Normal/lowContrast': {
//     id: 'S:bb2333acdadcd6bceed353585174c9165cca7bc7,',
//     key: 'bb2333acdadcd6bceed353585174c9165cca7bc7',
//   },
//   'Surface/Text/Normal/highContrast': {
//     id: 'S:533e39e6092dce4e15c8adad658b04a4a5b31b74,',
//     key: '533e39e6092dce4e15c8adad658b04a4a5b31b74',
//   },
//   'Surface/Text/Subtle/lowContrast': {
//     id: 'S:d2828d74bb5cf8d9ebe388ebc715feabad40acb0,',
//     key: 'd2828d74bb5cf8d9ebe388ebc715feabad40acb0',
//   },
//   'Surface/Text/Subtle/highContrast': {
//     id: 'S:15e4ccd503f7dfded363ff3e2c2d7dd1d96c2e3b,',
//     key: '15e4ccd503f7dfded363ff3e2c2d7dd1d96c2e3b',
//   },
//   'Surface/Text/Subdued/lowContrast': {
//     id: 'S:de2a01e21ef11c23457a6833d0bc0b917fac884f,',
//     key: 'de2a01e21ef11c23457a6833d0bc0b917fac884f',
//   },
//   'Surface/Text/Subdued/highContrast': {
//     id: 'S:00610c2fdab4972b0d0991c59a3c734fe842d667,',
//     key: '00610c2fdab4972b0d0991c59a3c734fe842d667',
//   },
//   'Surface/Text/Muted/lowContrast': {
//     id: 'S:9b7f632fa8aff594eb1a8a1be989ca2b7d4040c3,',
//     key: '9b7f632fa8aff594eb1a8a1be989ca2b7d4040c3',
//   },
//   'Surface/Text/Muted/highContrast': {
//     id: 'S:7711fcf0cc4017f21b504fa3673be63a34e59b7c,',
//     key: '7711fcf0cc4017f21b504fa3673be63a34e59b7c',
//   },
//   'Surface/Text/Placeholder/lowContrast': {
//     id: 'S:f46b2dff80c88fc2de6ce9eb5db21cfa5a31c42a,',
//     key: 'f46b2dff80c88fc2de6ce9eb5db21cfa5a31c42a',
//   },
//   'Surface/Text/Placeholder/highContrast': {
//     id: 'S:bf6445be1c5ecfb7eccdf9e24a5412be17a089f2,',
//     key: 'bf6445be1c5ecfb7eccdf9e24a5412be17a089f2',
//   },
//   'Surface/Action/Icon/lowContrast/Default': {
//     id: 'S:ab2ebda3a73fd88aa568632e6d061c21cc86d3e8,',
//     key: 'ab2ebda3a73fd88aa568632e6d061c21cc86d3e8',
//   },
//   'Surface/Action/Icon/lowContrast/Hover': {
//     id: 'S:1384b4549175a37e1dde0f86aa282de9e41d5bfe,',
//     key: '1384b4549175a37e1dde0f86aa282de9e41d5bfe',
//   },
//   'Surface/Action/Icon/lowContrast/Focus': {
//     id: 'S:9cdb3192a759273c9b5dba07fecb3018f765fde5,',
//     key: '9cdb3192a759273c9b5dba07fecb3018f765fde5',
//   },
//   'Surface/Action/Icon/lowContrast/Active': {
//     id: 'S:1a4c6b8018828d1a6712ef8719253ca395a87aa0,',
//     key: '1a4c6b8018828d1a6712ef8719253ca395a87aa0',
//   },
//   'Surface/Action/Icon/lowContrast/Disabled': {
//     id: 'S:fa7e3d93d539ceafc35ba5002e8a15b50aef9793,',
//     key: 'fa7e3d93d539ceafc35ba5002e8a15b50aef9793',
//   },
//   'Surface/Action/Icon/highContrast/Default': {
//     id: 'S:cfe335aec8b12cb25d2c1e5c425580668c59a17d,',
//     key: 'cfe335aec8b12cb25d2c1e5c425580668c59a17d',
//   },
//   'Surface/Action/Icon/highContrast/Hover': {
//     id: 'S:ca75e98b6fce736b847f1b34f52f1dffe4292438,',
//     key: 'ca75e98b6fce736b847f1b34f52f1dffe4292438',
//   },
//   'Surface/Action/Icon/highContrast/Focus': {
//     id: 'S:c52680b3d7efa7923d4a7de4280dedddea17ac65,',
//     key: 'c52680b3d7efa7923d4a7de4280dedddea17ac65',
//   },
//   'Surface/Action/Icon/highContrast/Active': {
//     id: 'S:45ebd6fc55cc9b72a363074bf65ad5508f630df9,',
//     key: '45ebd6fc55cc9b72a363074bf65ad5508f630df9',
//   },
//   'Surface/Action/Icon/highContrast/Disabled': {
//     id: 'S:254270a66969daac40bed1ec212d66daeb35fd80,',
//     key: '254270a66969daac40bed1ec212d66daeb35fd80',
//   },
//   'Surface/Overlay/Background': {
//     id: 'S:707101261f1d5ef4a113ca656ca48a532876fa99,',
//     key: '707101261f1d5ef4a113ca656ca48a532876fa99',
//   },
//   'Brand/Primary/300': {
//     id: 'S:29ba1d7b1644ad8d5670484864f6ac1f6db9ec02,',
//     key: '29ba1d7b1644ad8d5670484864f6ac1f6db9ec02',
//   },
//   'Brand/Primary/400': {
//     id: 'S:11511f674722089b8a21baca020a8839e0ae7fe1,',
//     key: '11511f674722089b8a21baca020a8839e0ae7fe1',
//   },
//   'Brand/Primary/500': {
//     id: 'S:90eaf639801ce82405ff7919eeca2a9f53e4b1b8,',
//     key: '90eaf639801ce82405ff7919eeca2a9f53e4b1b8',
//   },
//   'Brand/Primary/600': {
//     id: 'S:29792d86a407de9f2b8b94ae337887c4f128d736,',
//     key: '29792d86a407de9f2b8b94ae337887c4f128d736',
//   },
//   'Brand/Primary/700': {
//     id: 'S:e580083151d26db94fd838ee54793879b5968ef2,',
//     key: 'e580083151d26db94fd838ee54793879b5968ef2',
//   },
//   'Brand/Primary/800': {
//     id: 'S:94c343539f26e8737e4613bfa4a306beed2dd0c7,',
//     key: '94c343539f26e8737e4613bfa4a306beed2dd0c7',
//   },
//   'Brand/Gray/lowContrast/a50': {
//     id: 'S:3e4014d707c3e79598f237b033ac8d0e59dd0172,',
//     key: '3e4014d707c3e79598f237b033ac8d0e59dd0172',
//   },
//   'Brand/Gray/lowContrast/a100': {
//     id: 'S:4cfeadf6abd37371c890d9e3eee0c9f51f5841a3,',
//     key: '4cfeadf6abd37371c890d9e3eee0c9f51f5841a3',
//   },
//   'Brand/Gray/lowContrast/200': {
//     id: 'S:c171aa23f4057bdf48837ff1a90bee977f2ca20c,',
//     key: 'c171aa23f4057bdf48837ff1a90bee977f2ca20c',
//   },
//   'Brand/Gray/lowContrast/300': {
//     id: 'S:d3d69f9de6b8104f928671dd1561a2cd8be10775,',
//     key: 'd3d69f9de6b8104f928671dd1561a2cd8be10775',
//   },
//   'Brand/Gray/lowContrast/400': {
//     id: 'S:c380bdbd491b574c9a654cebacba03f2ce50e85a,',
//     key: 'c380bdbd491b574c9a654cebacba03f2ce50e85a',
//   },
//   'Brand/Gray/lowContrast/500': {
//     id: 'S:4492f707fb090bcd138166af22234f9023679feb,',
//     key: '4492f707fb090bcd138166af22234f9023679feb',
//   },
//   'Brand/Gray/lowContrast/600': {
//     id: 'S:60652308be16da87c701b339a5d035a595dd0c19,',
//     key: '60652308be16da87c701b339a5d035a595dd0c19',
//   },
//   'Brand/Gray/lowContrast/700': {
//     id: 'S:efc912d4671dba0f60a880c2446c49a73066383a,',
//     key: 'efc912d4671dba0f60a880c2446c49a73066383a',
//   },
//   'Brand/Gray/highContrast/a50': {
//     id: 'S:c30304feeab3c2a6eff92f2347e4089f1093d385,',
//     key: 'c30304feeab3c2a6eff92f2347e4089f1093d385',
//   },
//   'Brand/Gray/highContrast/a100': {
//     id: 'S:e8263ffa42f5056017ea26512bfeba580aa6988f,',
//     key: 'e8263ffa42f5056017ea26512bfeba580aa6988f',
//   },
//   'Brand/Gray/highContrast/200': {
//     id: 'S:bd84329bf5ea20ba3ee1133c150cc8f304a881d3,',
//     key: 'bd84329bf5ea20ba3ee1133c150cc8f304a881d3',
//   },
//   'Brand/Gray/highContrast/300': {
//     id: 'S:c773aea73c1aa36b0dae186cc56893dc77ad3240,',
//     key: 'c773aea73c1aa36b0dae186cc56893dc77ad3240',
//   },
//   'Brand/Gray/highContrast/400': {
//     id: 'S:3cacb49b6257d97f495acab88eb9974468f0793c,',
//     key: '3cacb49b6257d97f495acab88eb9974468f0793c',
//   },
//   'Brand/Gray/highContrast/500': {
//     id: 'S:418f88eb79125fedbf2d7824c77671fb8d4b71fc,',
//     key: '418f88eb79125fedbf2d7824c77671fb8d4b71fc',
//   },
//   'Brand/Gray/highContrast/600': {
//     id: 'S:8666d4224c12545991d43dc7c379e6e5b3417045,',
//     key: '8666d4224c12545991d43dc7c379e6e5b3417045',
//   },
//   'Brand/Gray/highContrast/700': {
//     id: 'S:8e745581ecc754b837bb01323b0587de7ccab2fd,',
//     key: '8e745581ecc754b837bb01323b0587de7ccab2fd',
//   },
//   'Brand/Secondary/500': {
//     id: 'S:adef454195c143c22c579bc682bcad407dcbe65a,',
//     key: 'adef454195c143c22c579bc682bcad407dcbe65a',
//   },
//   'Feedback/Background/Positive/lowContrast': {
//     id: 'S:6a7d7b4f7adb57bedc2637c6c5a0ad5b60b9ff91,',
//     key: '6a7d7b4f7adb57bedc2637c6c5a0ad5b60b9ff91',
//   },
//   'Feedback/Background/Positive/highContrast': {
//     id: 'S:edaf0bd2c2c91e29a762ce8723dcb5ceae54f676,',
//     key: 'edaf0bd2c2c91e29a762ce8723dcb5ceae54f676',
//   },
//   'Feedback/Background/Negative/lowContrast': {
//     id: 'S:f51cfe28d26daa3c581c88dce0e2502c4ae44eb7,',
//     key: 'f51cfe28d26daa3c581c88dce0e2502c4ae44eb7',
//   },
//   'Feedback/Background/Negative/highContrast': {
//     id: 'S:19053cd7af58ec843f7a885c3700aa4fd08a0236,',
//     key: '19053cd7af58ec843f7a885c3700aa4fd08a0236',
//   },
//   'Feedback/Background/Notice/lowContrast': {
//     id: 'S:a2a1b4f4657c6ecf51480da53b5adcec5910b9ea,',
//     key: 'a2a1b4f4657c6ecf51480da53b5adcec5910b9ea',
//   },
//   'Feedback/Background/Notice/highContrast': {
//     id: 'S:da518df990fc4aac8a448bc4c2fdce7fa3b8e544,',
//     key: 'da518df990fc4aac8a448bc4c2fdce7fa3b8e544',
//   },
//   'Feedback/Background/Info/lowContrast': {
//     id: 'S:32b84a90eb9be361fe61eaf556fd3fe9cf1acf04,',
//     key: '32b84a90eb9be361fe61eaf556fd3fe9cf1acf04',
//   },
//   'Feedback/Background/Info/highContrast': {
//     id: 'S:b3b98c537aede36b56e58e4a2c71408b37067248,',
//     key: 'b3b98c537aede36b56e58e4a2c71408b37067248',
//   },
//   'Feedback/Background/Neutral/lowContrast': {
//     id: 'S:c1c833638f498ff37c1c36beec4694cbf8950670,',
//     key: 'c1c833638f498ff37c1c36beec4694cbf8950670',
//   },
//   'Feedback/Background/Neutral/highContrast': {
//     id: 'S:99a1b574e83ce921890304392b5b85fa1e115217,',
//     key: '99a1b574e83ce921890304392b5b85fa1e115217',
//   },
//   'Feedback/Border/Positive/lowContrast': {
//     id: 'S:e2a493fe11ff95a98ef5b98407c073f1dd0e6e79,',
//     key: 'e2a493fe11ff95a98ef5b98407c073f1dd0e6e79',
//   },
//   'Feedback/Border/Positive/highContrast': {
//     id: 'S:e6e99532ff0eb64f8710de77dfb82b0d38c7a44c,',
//     key: 'e6e99532ff0eb64f8710de77dfb82b0d38c7a44c',
//   },
//   'Feedback/Border/Negative/lowContrast': {
//     id: 'S:92543dae51dc2385c21530ce87e10c2ca225cdf2,',
//     key: '92543dae51dc2385c21530ce87e10c2ca225cdf2',
//   },
//   'Feedback/Border/Negative/highContrast': {
//     id: 'S:a2603d11489c245f14bea2ef0195744c1e7087de,',
//     key: 'a2603d11489c245f14bea2ef0195744c1e7087de',
//   },
//   'Feedback/Border/Notice/lowContrast': {
//     id: 'S:1fefad246e4f41422db1be033868c113308421a6,',
//     key: '1fefad246e4f41422db1be033868c113308421a6',
//   },
//   'Feedback/Border/Notice/highContrast': {
//     id: 'S:670506957a945e21ff80e8dd99bbd0004a4be6d2,',
//     key: '670506957a945e21ff80e8dd99bbd0004a4be6d2',
//   },
//   'Feedback/Border/Info/lowContrast': {
//     id: 'S:4180191de355efa6a1559b2914c2d29090eb2111,',
//     key: '4180191de355efa6a1559b2914c2d29090eb2111',
//   },
//   'Feedback/Border/Info/highContrast': {
//     id: 'S:aa7b359588a2da906f2b19fee320c652a78b7146,',
//     key: 'aa7b359588a2da906f2b19fee320c652a78b7146',
//   },
//   'Feedback/Border/Neutral/lowContrast': {
//     id: 'S:501114e37c51dfa562180e6c17ba99c82becff88,',
//     key: '501114e37c51dfa562180e6c17ba99c82becff88',
//   },
//   'Feedback/Border/Neutral/highContrast': {
//     id: 'S:66ad663ba421019896d8cc500f44da1f0c3763c3,',
//     key: '66ad663ba421019896d8cc500f44da1f0c3763c3',
//   },
//   'Feedback/Text/Positive/lowContrast': {
//     id: 'S:c61aca5db3a21aead10da4889ad2b31c74d93529,',
//     key: 'c61aca5db3a21aead10da4889ad2b31c74d93529',
//   },
//   'Feedback/Text/Positive/highContrast': {
//     id: 'S:b5c1f56fef40283a1cdacd20358fe8dc98588f2e,',
//     key: 'b5c1f56fef40283a1cdacd20358fe8dc98588f2e',
//   },
//   'Feedback/Text/Negative/lowContrast': {
//     id: 'S:cccac5aac53e828b3be3e8617e462f8ee1a058dd,',
//     key: 'cccac5aac53e828b3be3e8617e462f8ee1a058dd',
//   },
//   'Feedback/Text/Negative/highContrast': {
//     id: 'S:39b81be380efc0ab269d805cfbb59bddba803752,',
//     key: '39b81be380efc0ab269d805cfbb59bddba803752',
//   },
//   'Feedback/Text/Notice/lowContrast': {
//     id: 'S:3050ae78cd32715f59b4cf34cc52fc780f0e84b2,',
//     key: '3050ae78cd32715f59b4cf34cc52fc780f0e84b2',
//   },
//   'Feedback/Text/Notice/highContrast': {
//     id: 'S:d2d321b5229ab732db71bf424b2b1bf3bf6b8abe,',
//     key: 'd2d321b5229ab732db71bf424b2b1bf3bf6b8abe',
//   },
//   'Feedback/Text/Info/lowContrast': {
//     id: 'S:e7c5e1df8315f0c744879ebee427733170db9fcd,',
//     key: 'e7c5e1df8315f0c744879ebee427733170db9fcd',
//   },
//   'Feedback/Text/Info/highContrast': {
//     id: 'S:7728189c0501cf03f0a0993d3fef5235a55d1b9e,',
//     key: '7728189c0501cf03f0a0993d3fef5235a55d1b9e',
//   },
//   'Feedback/Text/Neutral/lowContrast': {
//     id: 'S:337e665928993cbcb44a21ee1ce32fcadb4f9820,',
//     key: '337e665928993cbcb44a21ee1ce32fcadb4f9820',
//   },
//   'Feedback/Text/Neutral/highContrast': {
//     id: 'S:a561ac67f214567d9d8d23dcda71bfeeb8b68a5f,',
//     key: 'a561ac67f214567d9d8d23dcda71bfeeb8b68a5f',
//   },
//   'Feedback/Icon/Positive/lowContrast': {
//     id: 'S:f40d3fbf7bc1b8a735b93a5bc85d5b7ce5f8f034,',
//     key: 'f40d3fbf7bc1b8a735b93a5bc85d5b7ce5f8f034',
//   },
//   'Feedback/Icon/Positive/highContrast': {
//     id: 'S:3623c58504d4c0d6a1ae4da1ba49bd4030e5f7e9,',
//     key: '3623c58504d4c0d6a1ae4da1ba49bd4030e5f7e9',
//   },
//   'Feedback/Icon/Negative/lowContrast': {
//     id: 'S:e69eaf659fc52a13233ff620d80478e438bca5dc,',
//     key: 'e69eaf659fc52a13233ff620d80478e438bca5dc',
//   },
//   'Feedback/Icon/Negative/highContrast': {
//     id: 'S:a290cc2484bf85701fda11e8546ba649161d0758,',
//     key: 'a290cc2484bf85701fda11e8546ba649161d0758',
//   },
//   'Feedback/Icon/Notice/lowContrast': {
//     id: 'S:707d5fdfc748a5fc4777d212ee247bc40a86fe85,',
//     key: '707d5fdfc748a5fc4777d212ee247bc40a86fe85',
//   },
//   'Feedback/Icon/Notice/highContrast': {
//     id: 'S:3305aae9dbb7b8d8f2f5836402e868879be47f1d,',
//     key: '3305aae9dbb7b8d8f2f5836402e868879be47f1d',
//   },
//   'Feedback/Icon/Info/lowContrast': {
//     id: 'S:5c89e6cc0b76d7dbf138dbfe38b640cfcc2b3b97,',
//     key: '5c89e6cc0b76d7dbf138dbfe38b640cfcc2b3b97',
//   },
//   'Feedback/Icon/Info/highContrast': {
//     id: 'S:f1f1535945d55122aa12ed2655b524aa48635bc8,',
//     key: 'f1f1535945d55122aa12ed2655b524aa48635bc8',
//   },
//   'Feedback/Icon/Neutral/lowContrast': {
//     id: 'S:e69ee5c68c7bf691bf92a196e4c09c94a03b5658,',
//     key: 'e69ee5c68c7bf691bf92a196e4c09c94a03b5658',
//   },
//   'Feedback/Icon/Neutral/highContrast': {
//     id: 'S:de1167cce0a944ea186603cc0abe06033a62053c,',
//     key: 'de1167cce0a944ea186603cc0abe06033a62053c',
//   },
//   'Feedback/Action/Primary/Background/Positive/lowContrast/Default': {
//     id: 'S:b396de5474451b7876083b9fc228491a43847a03,',
//     key: 'b396de5474451b7876083b9fc228491a43847a03',
//   },
//   'Feedback/Action/Primary/Background/Positive/lowContrast/Hover': {
//     id: 'S:232d5a8d894af3d0830cb8927e76dbdc9e641acf,',
//     key: '232d5a8d894af3d0830cb8927e76dbdc9e641acf',
//   },
//   'Feedback/Action/Primary/Background/Positive/lowContrast/Focus': {
//     id: 'S:2abf05a6194cc436a86bc8926ae481411b431fda,',
//     key: '2abf05a6194cc436a86bc8926ae481411b431fda',
//   },
//   'Feedback/Action/Primary/Background/Positive/lowContrast/Active': {
//     id: 'S:6f6e2afc487d12cd6464d42b28bc16278f7ac1dd,',
//     key: '6f6e2afc487d12cd6464d42b28bc16278f7ac1dd',
//   },
//   'Feedback/Action/Primary/Background/Positive/lowContrast/Disabled': {
//     id: 'S:13729ecdba8af5b58f31cd3b7b4fda750d405a6c,',
//     key: '13729ecdba8af5b58f31cd3b7b4fda750d405a6c',
//   },
//   'Feedback/Action/Primary/Background/Positive/highContrast/Default': {
//     id: 'S:970cb0ab55a54a09b4bf15f9f0be29a6f1f16fcb,',
//     key: '970cb0ab55a54a09b4bf15f9f0be29a6f1f16fcb',
//   },
//   'Feedback/Action/Primary/Background/Positive/highContrast/Hover': {
//     id: 'S:7b6ad0e8fff620953f1652e5d12c0e2096219729,',
//     key: '7b6ad0e8fff620953f1652e5d12c0e2096219729',
//   },
//   'Feedback/Action/Primary/Background/Positive/highContrast/Focus': {
//     id: 'S:c32e44d527aba1438fcbce7716b0869717d05c83,',
//     key: 'c32e44d527aba1438fcbce7716b0869717d05c83',
//   },
//   'Feedback/Action/Primary/Background/Positive/highContrast/Active': {
//     id: 'S:de088d7f87e9131a5d72674ec65a56374e5fbeca,',
//     key: 'de088d7f87e9131a5d72674ec65a56374e5fbeca',
//   },
//   'Feedback/Action/Primary/Background/Positive/highContrast/Disabled': {
//     id: 'S:f590238875428264edfaed75d935910abe15c083,',
//     key: 'f590238875428264edfaed75d935910abe15c083',
//   },
//   'Feedback/Action/Primary/Background/Negative/lowContrast/Default': {
//     id: 'S:cab24a486b478ea6b898f99b175952cb3e291892,',
//     key: 'cab24a486b478ea6b898f99b175952cb3e291892',
//   },
//   'Feedback/Action/Primary/Background/Negative/lowContrast/Hover': {
//     id: 'S:3412444498786dead80357baacc5935781f8f948,',
//     key: '3412444498786dead80357baacc5935781f8f948',
//   },
//   'Feedback/Action/Primary/Background/Negative/lowContrast/Focus': {
//     id: 'S:9cef1e2b19f8f259c58ca81b1642c05f1ba5bc1e,',
//     key: '9cef1e2b19f8f259c58ca81b1642c05f1ba5bc1e',
//   },
//   'Feedback/Action/Primary/Background/Negative/lowContrast/Active': {
//     id: 'S:36779b201a8c933042a462333de7539edc317d79,',
//     key: '36779b201a8c933042a462333de7539edc317d79',
//   },
//   'Feedback/Action/Primary/Background/Negative/lowContrast/Disabled': {
//     id: 'S:c0b0cc67fbdd872003260638defd0b17fdc7e72e,',
//     key: 'c0b0cc67fbdd872003260638defd0b17fdc7e72e',
//   },
//   'Feedback/Action/Primary/Background/Negative/highContrast/Default': {
//     id: 'S:7ecbae583edbcf4e8ac1b049b7cf986c37275efe,',
//     key: '7ecbae583edbcf4e8ac1b049b7cf986c37275efe',
//   },
//   'Feedback/Action/Primary/Background/Negative/highContrast/Hover': {
//     id: 'S:aa0e6ff53a3286c448f389c79829754d7503d1f9,',
//     key: 'aa0e6ff53a3286c448f389c79829754d7503d1f9',
//   },
//   'Feedback/Action/Primary/Background/Negative/highContrast/Focus': {
//     id: 'S:42b51e9aaf772e251af7aca7f0d61919396709bd,',
//     key: '42b51e9aaf772e251af7aca7f0d61919396709bd',
//   },
//   'Feedback/Action/Primary/Background/Negative/highContrast/Active': {
//     id: 'S:56085e8b2c7a91d6952980790f2ac7e386d54c31,',
//     key: '56085e8b2c7a91d6952980790f2ac7e386d54c31',
//   },
//   'Feedback/Action/Primary/Background/Negative/highContrast/Disabled': {
//     id: 'S:64c464c2fe594ba1be1c463978f8259674aa9a18,',
//     key: '64c464c2fe594ba1be1c463978f8259674aa9a18',
//   },
//   'Feedback/Action/Primary/Background/Notice/lowContrast/Default': {
//     id: 'S:d29405dabc50c3b262c66e4a250f7fe37d3a1b94,',
//     key: 'd29405dabc50c3b262c66e4a250f7fe37d3a1b94',
//   },
//   'Feedback/Action/Primary/Background/Notice/lowContrast/Hover': {
//     id: 'S:19c5534bd97fc484e20dcf011db0861de199fa52,',
//     key: '19c5534bd97fc484e20dcf011db0861de199fa52',
//   },
//   'Feedback/Action/Primary/Background/Notice/lowContrast/Focus': {
//     id: 'S:cdfb68a0666c6c559dc4d3f6cd41c09741522bb4,',
//     key: 'cdfb68a0666c6c559dc4d3f6cd41c09741522bb4',
//   },
//   'Feedback/Action/Primary/Background/Notice/lowContrast/Active': {
//     id: 'S:b2d2c032bc20dee2cae1c84ae00bb09c9b715dd4,',
//     key: 'b2d2c032bc20dee2cae1c84ae00bb09c9b715dd4',
//   },
//   'Feedback/Action/Primary/Background/Notice/lowContrast/Disabled': {
//     id: 'S:4d70afc2ed5b145e6608d5f00054aef9a7441af2,',
//     key: '4d70afc2ed5b145e6608d5f00054aef9a7441af2',
//   },
//   'Feedback/Action/Primary/Background/Notice/highContrast/Default': {
//     id: 'S:b0b5198bfb23f5cd470be79701087d1d0d9984aa,',
//     key: 'b0b5198bfb23f5cd470be79701087d1d0d9984aa',
//   },
//   'Feedback/Action/Primary/Background/Notice/highContrast/Hover': {
//     id: 'S:d664bf655cb3502113c68533204d43b9b18b7a95,',
//     key: 'd664bf655cb3502113c68533204d43b9b18b7a95',
//   },
//   'Feedback/Action/Primary/Background/Notice/highContrast/Focus': {
//     id: 'S:1951a70017aaba04c80c0000ee557181fd07f48d,',
//     key: '1951a70017aaba04c80c0000ee557181fd07f48d',
//   },
//   'Feedback/Action/Primary/Background/Notice/highContrast/Active': {
//     id: 'S:b077dd86d374c20ba8a5edaa3e211c3eca860376,',
//     key: 'b077dd86d374c20ba8a5edaa3e211c3eca860376',
//   },
//   'Feedback/Action/Primary/Background/Notice/highContrast/Disabled': {
//     id: 'S:d903d7387eb438cb69ac48f35bf35d421a73ab69,',
//     key: 'd903d7387eb438cb69ac48f35bf35d421a73ab69',
//   },
//   'Feedback/Action/Primary/Background/Info/lowContrast/Default': {
//     id: 'S:48911425c505be8c579c052c356312dae9c65dc0,',
//     key: '48911425c505be8c579c052c356312dae9c65dc0',
//   },
//   'Feedback/Action/Primary/Background/Info/lowContrast/Hover': {
//     id: 'S:b1b81b604632bc77dd495edee303a91de38740de,',
//     key: 'b1b81b604632bc77dd495edee303a91de38740de',
//   },
//   'Feedback/Action/Primary/Background/Info/lowContrast/Focus': {
//     id: 'S:2586adde57be70f7860be007c60ea165a6016610,',
//     key: '2586adde57be70f7860be007c60ea165a6016610',
//   },
//   'Feedback/Action/Primary/Background/Info/lowContrast/Active': {
//     id: 'S:fd816257abfd5ddf84a3d40070ac4f00e62e69a7,',
//     key: 'fd816257abfd5ddf84a3d40070ac4f00e62e69a7',
//   },
//   'Feedback/Action/Primary/Background/Info/lowContrast/Disabled': {
//     id: 'S:02937ca35fc9e60262dcd8db40f7bffc6e9b7cf1,',
//     key: '02937ca35fc9e60262dcd8db40f7bffc6e9b7cf1',
//   },
//   'Feedback/Action/Primary/Background/Info/highContrast/Default': {
//     id: 'S:fe30b2baec164067a3b7b937d94286933fa8607d,',
//     key: 'fe30b2baec164067a3b7b937d94286933fa8607d',
//   },
//   'Feedback/Action/Primary/Background/Info/highContrast/Hover': {
//     id: 'S:3a7aef4c004f7411bc9b1c4294f6e680ca7abaad,',
//     key: '3a7aef4c004f7411bc9b1c4294f6e680ca7abaad',
//   },
//   'Feedback/Action/Primary/Background/Info/highContrast/Focus': {
//     id: 'S:94daf34d2ae6e8a2130b86a79c3089c952eab709,',
//     key: '94daf34d2ae6e8a2130b86a79c3089c952eab709',
//   },
//   'Feedback/Action/Primary/Background/Info/highContrast/Active': {
//     id: 'S:370c5333438c3151ecfce85bca30aecec7d99492,',
//     key: '370c5333438c3151ecfce85bca30aecec7d99492',
//   },
//   'Feedback/Action/Primary/Background/Info/highContrast/Disabled': {
//     id: 'S:2cb12579e0d409d3927402cb40bbac25b828ada1,',
//     key: '2cb12579e0d409d3927402cb40bbac25b828ada1',
//   },
//   'Feedback/Action/Primary/Background/Neutral/lowContrast/Default': {
//     id: 'S:c3d66846e384d89b9ab2052b5e259ca2148f1256,',
//     key: 'c3d66846e384d89b9ab2052b5e259ca2148f1256',
//   },
//   'Feedback/Action/Primary/Background/Neutral/lowContrast/Hover': {
//     id: 'S:1bcb36644f4338d17b1ba56246b91eb0f944cfaa,',
//     key: '1bcb36644f4338d17b1ba56246b91eb0f944cfaa',
//   },
//   'Feedback/Action/Primary/Background/Neutral/lowContrast/Focus': {
//     id: 'S:89878fb07bc0ec84b2ebce3590d5a9dc7c82288f,',
//     key: '89878fb07bc0ec84b2ebce3590d5a9dc7c82288f',
//   },
//   'Feedback/Action/Primary/Background/Neutral/lowContrast/Active': {
//     id: 'S:a7a523fca56d0d50b346de90fa5937edff517380,',
//     key: 'a7a523fca56d0d50b346de90fa5937edff517380',
//   },
//   'Feedback/Action/Primary/Background/Neutral/lowContrast/Disabled': {
//     id: 'S:dea6dd0c98de11ec0fabc6a198d4056f4dc0099a,',
//     key: 'dea6dd0c98de11ec0fabc6a198d4056f4dc0099a',
//   },
//   'Feedback/Action/Primary/Background/Neutral/highContrast/Default': {
//     id: 'S:5c8ff19c917800fd4d81ea8b37cb78ce75bd1b13,',
//     key: '5c8ff19c917800fd4d81ea8b37cb78ce75bd1b13',
//   },
//   'Feedback/Action/Primary/Background/Neutral/highContrast/Hover': {
//     id: 'S:04a65e3905d625657f014a4a1bdf593cbdcf32d2,',
//     key: '04a65e3905d625657f014a4a1bdf593cbdcf32d2',
//   },
//   'Feedback/Action/Primary/Background/Neutral/highContrast/Focus': {
//     id: 'S:cef90c591afff3aa92c63ba80976241d268a9d54,',
//     key: 'cef90c591afff3aa92c63ba80976241d268a9d54',
//   },
//   'Feedback/Action/Primary/Background/Neutral/highContrast/Active': {
//     id: 'S:a2705627390ad0b6f8fffae0e24b9a3897641b53,',
//     key: 'a2705627390ad0b6f8fffae0e24b9a3897641b53',
//   },
//   'Feedback/Action/Primary/Background/Neutral/highContrast/Disabled': {
//     id: 'S:42ffbbe635ffa29efe7496f5794c76d72fe41a3a,',
//     key: '42ffbbe635ffa29efe7496f5794c76d72fe41a3a',
//   },
//   'Feedback/Action/Primary/Border/Positive/lowContrast/Default': {
//     id: 'S:07b419313200a55178b5e97f380bbe18968f2fba,',
//     key: '07b419313200a55178b5e97f380bbe18968f2fba',
//   },
//   'Feedback/Action/Primary/Border/Positive/lowContrast/Hover': {
//     id: 'S:707684f35234838478191fc0283bdeca8083643c,',
//     key: '707684f35234838478191fc0283bdeca8083643c',
//   },
//   'Feedback/Action/Primary/Border/Positive/lowContrast/Focus': {
//     id: 'S:3d497408674d85f438e5f1bdbf8094d1bfa7351d,',
//     key: '3d497408674d85f438e5f1bdbf8094d1bfa7351d',
//   },
//   'Feedback/Action/Primary/Border/Positive/lowContrast/Active': {
//     id: 'S:b50aa449cab90b3918b8d5effc322f54946fa9db,',
//     key: 'b50aa449cab90b3918b8d5effc322f54946fa9db',
//   },
//   'Feedback/Action/Primary/Border/Positive/lowContrast/Disabled': {
//     id: 'S:be6d577b6643a27ed6e20271a66ecb07645916e5,',
//     key: 'be6d577b6643a27ed6e20271a66ecb07645916e5',
//   },
//   'Feedback/Action/Primary/Border/Positive/highContrast/Default': {
//     id: 'S:bd41db48e0f82206f5e5d45a4684e6ecd78ecd7c,',
//     key: 'bd41db48e0f82206f5e5d45a4684e6ecd78ecd7c',
//   },
//   'Feedback/Action/Primary/Border/Positive/highContrast/Hover': {
//     id: 'S:73f03e82c1fa05d1eda01e6defe0b44cb3971eb5,',
//     key: '73f03e82c1fa05d1eda01e6defe0b44cb3971eb5',
//   },
//   'Feedback/Action/Primary/Border/Positive/highContrast/Focus': {
//     id: 'S:03438fe117adc938f97f0c7695f59b3979fe7b5f,',
//     key: '03438fe117adc938f97f0c7695f59b3979fe7b5f',
//   },
//   'Feedback/Action/Primary/Border/Positive/highContrast/Active': {
//     id: 'S:9735a31bafa5a5ec615f9a54e903ddbbe7067afa,',
//     key: '9735a31bafa5a5ec615f9a54e903ddbbe7067afa',
//   },
//   'Feedback/Action/Primary/Border/Positive/highContrast/Disabled': {
//     id: 'S:baacb20a85ccb8bfc2789da3337dcd18a84b2b61,',
//     key: 'baacb20a85ccb8bfc2789da3337dcd18a84b2b61',
//   },
//   'Feedback/Action/Primary/Border/Negative/lowContrast/Default': {
//     id: 'S:1e0180dbc418dbecbbda0f89d3604c010a4f6028,',
//     key: '1e0180dbc418dbecbbda0f89d3604c010a4f6028',
//   },
//   'Feedback/Action/Primary/Border/Negative/lowContrast/Hover': {
//     id: 'S:eeb29469968aa4e8ed021de41981317c46ebcbac,',
//     key: 'eeb29469968aa4e8ed021de41981317c46ebcbac',
//   },
//   'Feedback/Action/Primary/Border/Negative/lowContrast/Focus': {
//     id: 'S:4469eb8c471ef5bfe310c65a15430dd77e74512a,',
//     key: '4469eb8c471ef5bfe310c65a15430dd77e74512a',
//   },
//   'Feedback/Action/Primary/Border/Negative/lowContrast/Active': {
//     id: 'S:bc6f2e954cd63af2e839fcd479fba79fb4a06f3e,',
//     key: 'bc6f2e954cd63af2e839fcd479fba79fb4a06f3e',
//   },
//   'Feedback/Action/Primary/Border/Negative/lowContrast/Disabled': {
//     id: 'S:d88eed93ea73ba70c6a508fa482fe9ee55a853ef,',
//     key: 'd88eed93ea73ba70c6a508fa482fe9ee55a853ef',
//   },
//   'Feedback/Action/Primary/Border/Negative/highContrast/Default': {
//     id: 'S:1586a62239b070e858dcda45ba8376db996e36f1,',
//     key: '1586a62239b070e858dcda45ba8376db996e36f1',
//   },
//   'Feedback/Action/Primary/Border/Negative/highContrast/Hover': {
//     id: 'S:17d918358eef2e2091be0e6a3b6739176c7e81f3,',
//     key: '17d918358eef2e2091be0e6a3b6739176c7e81f3',
//   },
//   'Feedback/Action/Primary/Border/Negative/highContrast/Focus': {
//     id: 'S:9edd736170b58ab434c0bb80d2559392dc69d216,',
//     key: '9edd736170b58ab434c0bb80d2559392dc69d216',
//   },
//   'Feedback/Action/Primary/Border/Negative/highContrast/Active': {
//     id: 'S:a4dbbb4d956b0fc2b635182fdcf80db4507b5e08,',
//     key: 'a4dbbb4d956b0fc2b635182fdcf80db4507b5e08',
//   },
//   'Feedback/Action/Primary/Border/Negative/highContrast/Disabled': {
//     id: 'S:ff8a85f7092e9656eaefffa38fbfc89b6b38230f,',
//     key: 'ff8a85f7092e9656eaefffa38fbfc89b6b38230f',
//   },
//   'Feedback/Action/Primary/Border/Notice/lowContrast/Default': {
//     id: 'S:63223ee5158847d7f704428dadb0a2b2642debc9,',
//     key: '63223ee5158847d7f704428dadb0a2b2642debc9',
//   },
//   'Feedback/Action/Primary/Border/Notice/lowContrast/Hover': {
//     id: 'S:fa7d94c7743508948e60f5f2fd44bb710df5cf33,',
//     key: 'fa7d94c7743508948e60f5f2fd44bb710df5cf33',
//   },
//   'Feedback/Action/Primary/Border/Notice/lowContrast/Focus': {
//     id: 'S:a4bbcabd0c5e49525f9f3c92fae0da5b9917ba8e,',
//     key: 'a4bbcabd0c5e49525f9f3c92fae0da5b9917ba8e',
//   },
//   'Feedback/Action/Primary/Border/Notice/lowContrast/Active': {
//     id: 'S:69e2bdfbd9d597a62957179bd41423f158e1453d,',
//     key: '69e2bdfbd9d597a62957179bd41423f158e1453d',
//   },
//   'Feedback/Action/Primary/Border/Notice/lowContrast/Disabled': {
//     id: 'S:eddc789bdc23743551a6381fa98c8e8add679696,',
//     key: 'eddc789bdc23743551a6381fa98c8e8add679696',
//   },
//   'Feedback/Action/Primary/Border/Notice/highContrast/Default': {
//     id: 'S:cb219d150ed88b2ad793f31afdc4b82849598e45,',
//     key: 'cb219d150ed88b2ad793f31afdc4b82849598e45',
//   },
//   'Feedback/Action/Primary/Border/Notice/highContrast/Hover': {
//     id: 'S:d2a6e0876ef026344dcdc4c4af417a7844a99559,',
//     key: 'd2a6e0876ef026344dcdc4c4af417a7844a99559',
//   },
//   'Feedback/Action/Primary/Border/Notice/highContrast/Focus': {
//     id: 'S:100c75ded2cb4166d5692ebd9c9bf06d9c50827b,',
//     key: '100c75ded2cb4166d5692ebd9c9bf06d9c50827b',
//   },
//   'Feedback/Action/Primary/Border/Notice/highContrast/Active': {
//     id: 'S:14d17f73565a9e63e07b2a6862147fd53834007a,',
//     key: '14d17f73565a9e63e07b2a6862147fd53834007a',
//   },
//   'Feedback/Action/Primary/Border/Notice/highContrast/Disabled': {
//     id: 'S:7b166b71f7c4dbebe7b0afa7584df49128d7f4f0,',
//     key: '7b166b71f7c4dbebe7b0afa7584df49128d7f4f0',
//   },
//   'Feedback/Action/Primary/Border/Info/lowContrast/Default': {
//     id: 'S:6117bac6a25f80ca0b9a860ac66ba59e6b3d4aea,',
//     key: '6117bac6a25f80ca0b9a860ac66ba59e6b3d4aea',
//   },
//   'Feedback/Action/Primary/Border/Info/lowContrast/Hover': {
//     id: 'S:75ad7a086aab46ab008c15a4610363e8d6e55459,',
//     key: '75ad7a086aab46ab008c15a4610363e8d6e55459',
//   },
//   'Feedback/Action/Primary/Border/Info/lowContrast/Focus': {
//     id: 'S:d5a8512032c9e83d50b272c5a7d0cc4bf9a4a07c,',
//     key: 'd5a8512032c9e83d50b272c5a7d0cc4bf9a4a07c',
//   },
//   'Feedback/Action/Primary/Border/Info/lowContrast/Active': {
//     id: 'S:24a68633d582407769eebb0ebfb603aed06da545,',
//     key: '24a68633d582407769eebb0ebfb603aed06da545',
//   },
//   'Feedback/Action/Primary/Border/Info/lowContrast/Disabled': {
//     id: 'S:3eea2eeb80917e59f7087d0432a2cc4bb24aa2fd,',
//     key: '3eea2eeb80917e59f7087d0432a2cc4bb24aa2fd',
//   },
//   'Feedback/Action/Primary/Border/Info/highContrast/Default': {
//     id: 'S:e2a4d30f25ee43464899c4905d77f41b353a8ce7,',
//     key: 'e2a4d30f25ee43464899c4905d77f41b353a8ce7',
//   },
//   'Feedback/Action/Primary/Border/Info/highContrast/Hover': {
//     id: 'S:087e76775b093b01e26c474a35ce3db2915bc363,',
//     key: '087e76775b093b01e26c474a35ce3db2915bc363',
//   },
//   'Feedback/Action/Primary/Border/Info/highContrast/Focus': {
//     id: 'S:65f12e4d6588c37b6ed475cdc888cde906cf240a,',
//     key: '65f12e4d6588c37b6ed475cdc888cde906cf240a',
//   },
//   'Feedback/Action/Primary/Border/Info/highContrast/Active': {
//     id: 'S:67c5cbe3e9b5c461aaf1f2a9a0bd8b84cc106a2d,',
//     key: '67c5cbe3e9b5c461aaf1f2a9a0bd8b84cc106a2d',
//   },
//   'Feedback/Action/Primary/Border/Info/highContrast/Disabled': {
//     id: 'S:fe84774f9420d4d045d651ec9aa4d53c6a14e53d,',
//     key: 'fe84774f9420d4d045d651ec9aa4d53c6a14e53d',
//   },
//   'Feedback/Action/Primary/Border/Neutral/lowContrast/Default': {
//     id: 'S:e59ec3e0c2ae58d68b700615e041f1a4ae8b7e54,',
//     key: 'e59ec3e0c2ae58d68b700615e041f1a4ae8b7e54',
//   },
//   'Feedback/Action/Primary/Border/Neutral/lowContrast/Hover': {
//     id: 'S:d9b64bf65b93ff98a542cdadc06446271185e0f8,',
//     key: 'd9b64bf65b93ff98a542cdadc06446271185e0f8',
//   },
//   'Feedback/Action/Primary/Border/Neutral/lowContrast/Focus': {
//     id: 'S:3bf2636b2a280a8d621ec90c6c42cf02468bc285,',
//     key: '3bf2636b2a280a8d621ec90c6c42cf02468bc285',
//   },
//   'Feedback/Action/Primary/Border/Neutral/lowContrast/Active': {
//     id: 'S:8bc3a51d6a210ebcb8993ad284cddd2eeb836d88,',
//     key: '8bc3a51d6a210ebcb8993ad284cddd2eeb836d88',
//   },
//   'Feedback/Action/Primary/Border/Neutral/lowContrast/Disabled': {
//     id: 'S:9258fe67cfc7905241e638ccf60c689801335b81,',
//     key: '9258fe67cfc7905241e638ccf60c689801335b81',
//   },
//   'Feedback/Action/Primary/Border/Neutral/highContrast/Default': {
//     id: 'S:55843763ccf46913b22d6dec22125e2db5006cf8,',
//     key: '55843763ccf46913b22d6dec22125e2db5006cf8',
//   },
//   'Feedback/Action/Primary/Border/Neutral/highContrast/Hover': {
//     id: 'S:0109d6fe65cf03c6f1186cd85495ede188fdc7e1,',
//     key: '0109d6fe65cf03c6f1186cd85495ede188fdc7e1',
//   },
//   'Feedback/Action/Primary/Border/Neutral/highContrast/Focus': {
//     id: 'S:fcb9efcb67ef93b2a6f9b48a3fb15e16194b22e4,',
//     key: 'fcb9efcb67ef93b2a6f9b48a3fb15e16194b22e4',
//   },
//   'Feedback/Action/Primary/Border/Neutral/highContrast/Active': {
//     id: 'S:43659c19ce4c89e7772273f6943b99c8e43f8121,',
//     key: '43659c19ce4c89e7772273f6943b99c8e43f8121',
//   },
//   'Feedback/Action/Primary/Border/Neutral/highContrast/Disabled': {
//     id: 'S:eda2e083f37a1496b70c117ff29b77348b7307cb,',
//     key: 'eda2e083f37a1496b70c117ff29b77348b7307cb',
//   },
//   'Feedback/Action/Primary/Text/Positive/lowContrast/Default': {
//     id: 'S:957f6bf1cb3a29474f19e6375e9885b3eaeb4c81,',
//     key: '957f6bf1cb3a29474f19e6375e9885b3eaeb4c81',
//   },
//   'Feedback/Action/Primary/Text/Positive/lowContrast/Hover': {
//     id: 'S:aed1955089307d1c7c3db8e3170140b04cdf0546,',
//     key: 'aed1955089307d1c7c3db8e3170140b04cdf0546',
//   },
//   'Feedback/Action/Primary/Text/Positive/lowContrast/Focus': {
//     id: 'S:9f17e8cb386c7d5d8591f11374c17293a22382fd,',
//     key: '9f17e8cb386c7d5d8591f11374c17293a22382fd',
//   },
//   'Feedback/Action/Primary/Text/Positive/lowContrast/Active': {
//     id: 'S:b07b52d973c74b14c177d4ffcf02f10d263d2c7d,',
//     key: 'b07b52d973c74b14c177d4ffcf02f10d263d2c7d',
//   },
//   'Feedback/Action/Primary/Text/Positive/lowContrast/Disabled': {
//     id: 'S:c5e7bc5c4ca0a42b10991016237eac6d3b775e6b,',
//     key: 'c5e7bc5c4ca0a42b10991016237eac6d3b775e6b',
//   },
//   'Feedback/Action/Primary/Text/Positive/highContrast/Default': {
//     id: 'S:9c37190105b6065596e1c602dcf29e5128b4fedd,',
//     key: '9c37190105b6065596e1c602dcf29e5128b4fedd',
//   },
//   'Feedback/Action/Primary/Text/Positive/highContrast/Hover': {
//     id: 'S:59dccf3d1bfc4cc667fa610139358c088c342cc5,',
//     key: '59dccf3d1bfc4cc667fa610139358c088c342cc5',
//   },
//   'Feedback/Action/Primary/Text/Positive/highContrast/Focus': {
//     id: 'S:5d0add9b8174e94e8339aa06d47b07d3d4b0dd52,',
//     key: '5d0add9b8174e94e8339aa06d47b07d3d4b0dd52',
//   },
//   'Feedback/Action/Primary/Text/Positive/highContrast/Active': {
//     id: 'S:400c58fe39187707acfda8ac8a2bf86e0c2b44ec,',
//     key: '400c58fe39187707acfda8ac8a2bf86e0c2b44ec',
//   },
//   'Feedback/Action/Primary/Text/Positive/highContrast/Disabled': {
//     id: 'S:e4c89bbdb025e21700555ed1a9ff951204568a53,',
//     key: 'e4c89bbdb025e21700555ed1a9ff951204568a53',
//   },
//   'Feedback/Action/Primary/Text/Negative/lowContrast/Default': {
//     id: 'S:e516641c795843bfd65b3bc41f0679dac65577c0,',
//     key: 'e516641c795843bfd65b3bc41f0679dac65577c0',
//   },
//   'Feedback/Action/Primary/Text/Negative/lowContrast/Hover': {
//     id: 'S:e9817ba6c9e6508bfb587ff6567ff61aa3085419,',
//     key: 'e9817ba6c9e6508bfb587ff6567ff61aa3085419',
//   },
//   'Feedback/Action/Primary/Text/Negative/lowContrast/Focus': {
//     id: 'S:f6a32a1b5f658304e587049f875a3ba41c002319,',
//     key: 'f6a32a1b5f658304e587049f875a3ba41c002319',
//   },
//   'Feedback/Action/Primary/Text/Negative/lowContrast/Active': {
//     id: 'S:58003b1cc4000b65c8db26d43df757b12b76622b,',
//     key: '58003b1cc4000b65c8db26d43df757b12b76622b',
//   },
//   'Feedback/Action/Primary/Text/Negative/lowContrast/Disabled': {
//     id: 'S:7a8436c73f9b55709817b3aa9af179512b824412,',
//     key: '7a8436c73f9b55709817b3aa9af179512b824412',
//   },
//   'Feedback/Action/Primary/Text/Negative/highContrast/Default': {
//     id: 'S:03610bdc8ad61c754a266472ecfd4c4ac58660c1,',
//     key: '03610bdc8ad61c754a266472ecfd4c4ac58660c1',
//   },
//   'Feedback/Action/Primary/Text/Negative/highContrast/Hover': {
//     id: 'S:3ffb0d283beae2dfa20cb6147ee889a19bf00eff,',
//     key: '3ffb0d283beae2dfa20cb6147ee889a19bf00eff',
//   },
//   'Feedback/Action/Primary/Text/Negative/highContrast/Focus': {
//     id: 'S:b42096564c0266a1e3844a362bb71a40ef05e7d4,',
//     key: 'b42096564c0266a1e3844a362bb71a40ef05e7d4',
//   },
//   'Feedback/Action/Primary/Text/Negative/highContrast/Active': {
//     id: 'S:0b191469f1fa8f1fc83295ce1bc73b0827b55f16,',
//     key: '0b191469f1fa8f1fc83295ce1bc73b0827b55f16',
//   },
//   'Feedback/Action/Primary/Text/Negative/highContrast/Disabled': {
//     id: 'S:54a1da24cddf7dd17a996d2b939eb8b67a865702,',
//     key: '54a1da24cddf7dd17a996d2b939eb8b67a865702',
//   },
//   'Feedback/Action/Primary/Text/Notice/lowContrast/Default': {
//     id: 'S:679beaa2f7c8d91d297f434c707c4de577045f44,',
//     key: '679beaa2f7c8d91d297f434c707c4de577045f44',
//   },
//   'Feedback/Action/Primary/Text/Notice/lowContrast/Hover': {
//     id: 'S:aadc263227234ad355898ac52831c50274c7f041,',
//     key: 'aadc263227234ad355898ac52831c50274c7f041',
//   },
//   'Feedback/Action/Primary/Text/Notice/lowContrast/Focus': {
//     id: 'S:ed1137d54d1a1ee0a3a9a1df9823674cd2d0ddd9,',
//     key: 'ed1137d54d1a1ee0a3a9a1df9823674cd2d0ddd9',
//   },
//   'Feedback/Action/Primary/Text/Notice/lowContrast/Active': {
//     id: 'S:e7a482ca424b1cb664ea743e013a1e61680d1cd6,',
//     key: 'e7a482ca424b1cb664ea743e013a1e61680d1cd6',
//   },
//   'Feedback/Action/Primary/Text/Notice/lowContrast/Disabled': {
//     id: 'S:a04e5c54613cb82588c248fb58c7238b580fda2a,',
//     key: 'a04e5c54613cb82588c248fb58c7238b580fda2a',
//   },
//   'Feedback/Action/Primary/Text/Notice/highContrast/Default': {
//     id: 'S:85ebb1c9124b89dd1a8e2060ca176ad15f1f7ab1,',
//     key: '85ebb1c9124b89dd1a8e2060ca176ad15f1f7ab1',
//   },
//   'Feedback/Action/Primary/Text/Notice/highContrast/Hover': {
//     id: 'S:109bbb6ec08e1ab300e6600dd69f0e85f21247f5,',
//     key: '109bbb6ec08e1ab300e6600dd69f0e85f21247f5',
//   },
//   'Feedback/Action/Primary/Text/Notice/highContrast/Focus': {
//     id: 'S:443c75f1b35dfc49687538fce0bbcff226885665,',
//     key: '443c75f1b35dfc49687538fce0bbcff226885665',
//   },
//   'Feedback/Action/Primary/Text/Notice/highContrast/Active': {
//     id: 'S:57ea13a35c52b3089bb61953ade10d983467c19a,',
//     key: '57ea13a35c52b3089bb61953ade10d983467c19a',
//   },
//   'Feedback/Action/Primary/Text/Notice/highContrast/Disabled': {
//     id: 'S:6ac4c75e1961c703bb96cfc14961546afbed6b72,',
//     key: '6ac4c75e1961c703bb96cfc14961546afbed6b72',
//   },
//   'Feedback/Action/Primary/Text/Info/lowContrast/Default': {
//     id: 'S:9356ca9f8e5e68b77bacdd63f352303ca93c9dc8,',
//     key: '9356ca9f8e5e68b77bacdd63f352303ca93c9dc8',
//   },
//   'Feedback/Action/Primary/Text/Info/lowContrast/Hover': {
//     id: 'S:59f462deac071b51aa4f6d6b94142dae4c7b910c,',
//     key: '59f462deac071b51aa4f6d6b94142dae4c7b910c',
//   },
//   'Feedback/Action/Primary/Text/Info/lowContrast/Focus': {
//     id: 'S:bdcc57c68ad3bffc279616b3fac09b6dddcc085e,',
//     key: 'bdcc57c68ad3bffc279616b3fac09b6dddcc085e',
//   },
//   'Feedback/Action/Primary/Text/Info/lowContrast/Active': {
//     id: 'S:aea5240aac0752bad45978df1351d39b8e3b4f94,',
//     key: 'aea5240aac0752bad45978df1351d39b8e3b4f94',
//   },
//   'Feedback/Action/Primary/Text/Info/lowContrast/Disabled': {
//     id: 'S:64f75ffeecfe21fe15abecd593ac522662842630,',
//     key: '64f75ffeecfe21fe15abecd593ac522662842630',
//   },
//   'Feedback/Action/Primary/Text/Info/highContrast/Default': {
//     id: 'S:ef63aac361390217a768c02fa54257d0be529c13,',
//     key: 'ef63aac361390217a768c02fa54257d0be529c13',
//   },
//   'Feedback/Action/Primary/Text/Info/highContrast/Hover': {
//     id: 'S:91f2148e00ecb71764129bb62ad728f43c8a07c9,',
//     key: '91f2148e00ecb71764129bb62ad728f43c8a07c9',
//   },
//   'Feedback/Action/Primary/Text/Info/highContrast/Focus': {
//     id: 'S:375eeb9d818079d0aff3e2b0406731965a418b6b,',
//     key: '375eeb9d818079d0aff3e2b0406731965a418b6b',
//   },
//   'Feedback/Action/Primary/Text/Info/highContrast/Active': {
//     id: 'S:704bcf7a382be8e936eafc858553c5d4d66c3753,',
//     key: '704bcf7a382be8e936eafc858553c5d4d66c3753',
//   },
//   'Feedback/Action/Primary/Text/Info/highContrast/Disabled': {
//     id: 'S:bac306d0fa91dc6cbc4c367456df26010f1d7273,',
//     key: 'bac306d0fa91dc6cbc4c367456df26010f1d7273',
//   },
//   'Feedback/Action/Primary/Text/Neutral/lowContrast/Default': {
//     id: 'S:6e793ebb51b42d279890c0b17eaef17c91d03b8f,',
//     key: '6e793ebb51b42d279890c0b17eaef17c91d03b8f',
//   },
//   'Feedback/Action/Primary/Text/Neutral/lowContrast/Hover': {
//     id: 'S:803b156aadbd1d4fd0ec750339b0f6c290e67530,',
//     key: '803b156aadbd1d4fd0ec750339b0f6c290e67530',
//   },
//   'Feedback/Action/Primary/Text/Neutral/lowContrast/Focus': {
//     id: 'S:7c7af102c3725e5fb3e69975fc2b764b9c4cce4f,',
//     key: '7c7af102c3725e5fb3e69975fc2b764b9c4cce4f',
//   },
//   'Feedback/Action/Primary/Text/Neutral/lowContrast/Active': {
//     id: 'S:321bd2a5c46ad2626ec29145130ea6cf5342f8f1,',
//     key: '321bd2a5c46ad2626ec29145130ea6cf5342f8f1',
//   },
//   'Feedback/Action/Primary/Text/Neutral/lowContrast/Disabled': {
//     id: 'S:6177aef6976b98dacb606b0c74918da2959ad0fc,',
//     key: '6177aef6976b98dacb606b0c74918da2959ad0fc',
//   },
//   'Feedback/Action/Primary/Text/Neutral/highContrast/Default': {
//     id: 'S:1ffc9be40dd372e2d345737140e25949af804511,',
//     key: '1ffc9be40dd372e2d345737140e25949af804511',
//   },
//   'Feedback/Action/Primary/Text/Neutral/highContrast/Hover': {
//     id: 'S:484f56b388e773653f9b1634617d2fc493b84a66,',
//     key: '484f56b388e773653f9b1634617d2fc493b84a66',
//   },
//   'Feedback/Action/Primary/Text/Neutral/highContrast/Focus': {
//     id: 'S:0bfa219793fd567dd85b8c893b326ec6c4d49ca5,',
//     key: '0bfa219793fd567dd85b8c893b326ec6c4d49ca5',
//   },
//   'Feedback/Action/Primary/Text/Neutral/highContrast/Active': {
//     id: 'S:dbd3e539ff3d5f1dbaa640e8dc502c011c9f5fda,',
//     key: 'dbd3e539ff3d5f1dbaa640e8dc502c011c9f5fda',
//   },
//   'Feedback/Action/Primary/Text/Neutral/highContrast/Disabled': {
//     id: 'S:237ef90e374dba183b49c40b96a4503d4265f0e2,',
//     key: '237ef90e374dba183b49c40b96a4503d4265f0e2',
//   },
//   'Feedback/Action/Primary/Icon/Positive/lowContrast/Default': {
//     id: 'S:1f37ae58614ffdeb5a4eb998bf13687a5a5e5943,',
//     key: '1f37ae58614ffdeb5a4eb998bf13687a5a5e5943',
//   },
//   'Feedback/Action/Primary/Icon/Positive/lowContrast/Hover': {
//     id: 'S:005963fa63eda9a0f28c79270b5fefe259c53e0d,',
//     key: '005963fa63eda9a0f28c79270b5fefe259c53e0d',
//   },
//   'Feedback/Action/Primary/Icon/Positive/lowContrast/Focus': {
//     id: 'S:ecd2c9382971fda812b19150af60f36f9c86c925,',
//     key: 'ecd2c9382971fda812b19150af60f36f9c86c925',
//   },
//   'Feedback/Action/Primary/Icon/Positive/lowContrast/Active': {
//     id: 'S:d41b3bdb4629eb892fd8a94e49584c50441e7b15,',
//     key: 'd41b3bdb4629eb892fd8a94e49584c50441e7b15',
//   },
//   'Feedback/Action/Primary/Icon/Positive/lowContrast/Disabled': {
//     id: 'S:92acd953a5332dc0924eff9ac55f603f576fcda2,',
//     key: '92acd953a5332dc0924eff9ac55f603f576fcda2',
//   },
//   'Feedback/Action/Primary/Icon/Positive/highContrast/Default': {
//     id: 'S:fec48cbd28b94da48f877662a1e2408fe7261448,',
//     key: 'fec48cbd28b94da48f877662a1e2408fe7261448',
//   },
//   'Feedback/Action/Primary/Icon/Positive/highContrast/Hover': {
//     id: 'S:4e66402139a8ef77434b7b487f28e8561b9489ef,',
//     key: '4e66402139a8ef77434b7b487f28e8561b9489ef',
//   },
//   'Feedback/Action/Primary/Icon/Positive/highContrast/Focus': {
//     id: 'S:cf820cf2443701accb57207e76916ac0b08226de,',
//     key: 'cf820cf2443701accb57207e76916ac0b08226de',
//   },
//   'Feedback/Action/Primary/Icon/Positive/highContrast/Active': {
//     id: 'S:616dfec856275f5ec625e4918cdc9337c9dcc28b,',
//     key: '616dfec856275f5ec625e4918cdc9337c9dcc28b',
//   },
//   'Feedback/Action/Primary/Icon/Positive/highContrast/Disabled': {
//     id: 'S:d2eb6834d0549d9d2131d65d920a9045675a26f2,',
//     key: 'd2eb6834d0549d9d2131d65d920a9045675a26f2',
//   },
//   'Feedback/Action/Primary/Icon/Negative/lowContrast/Default': {
//     id: 'S:dfe5119e1810fe3014dc699787774962674b5209,',
//     key: 'dfe5119e1810fe3014dc699787774962674b5209',
//   },
//   'Feedback/Action/Primary/Icon/Negative/lowContrast/Hover': {
//     id: 'S:23530d639eeeda315829f2a9821b17e62f9f1b6c,',
//     key: '23530d639eeeda315829f2a9821b17e62f9f1b6c',
//   },
//   'Feedback/Action/Primary/Icon/Negative/lowContrast/Focus': {
//     id: 'S:79df8c88bc4722187d31ed7ba57ceb6293fc9c70,',
//     key: '79df8c88bc4722187d31ed7ba57ceb6293fc9c70',
//   },
//   'Feedback/Action/Primary/Icon/Negative/lowContrast/Active': {
//     id: 'S:ffdc0492eaef15bc069d6fa2eeccb08f5b24497d,',
//     key: 'ffdc0492eaef15bc069d6fa2eeccb08f5b24497d',
//   },
//   'Feedback/Action/Primary/Icon/Negative/lowContrast/Disabled': {
//     id: 'S:b0fd75d5692fd6b6b0f55ff14993c8bd945772fc,',
//     key: 'b0fd75d5692fd6b6b0f55ff14993c8bd945772fc',
//   },
//   'Feedback/Action/Primary/Icon/Negative/highContrast/Default': {
//     id: 'S:8adca66fba211acac8e030b1ab77945c088f111f,',
//     key: '8adca66fba211acac8e030b1ab77945c088f111f',
//   },
//   'Feedback/Action/Primary/Icon/Negative/highContrast/Hover': {
//     id: 'S:c686c4f67b66f218bf22a23469a3a7e1423ef45c,',
//     key: 'c686c4f67b66f218bf22a23469a3a7e1423ef45c',
//   },
//   'Feedback/Action/Primary/Icon/Negative/highContrast/Focus': {
//     id: 'S:e5398403ad61abf7f1858f143396fd45454d13bd,',
//     key: 'e5398403ad61abf7f1858f143396fd45454d13bd',
//   },
//   'Feedback/Action/Primary/Icon/Negative/highContrast/Active': {
//     id: 'S:8d26ed3539c059b8d3da5df1d75d390f261e4f3a,',
//     key: '8d26ed3539c059b8d3da5df1d75d390f261e4f3a',
//   },
//   'Feedback/Action/Primary/Icon/Negative/highContrast/Disabled': {
//     id: 'S:ddd26ca3af2affc6b359d471a1009d9b3192fb24,',
//     key: 'ddd26ca3af2affc6b359d471a1009d9b3192fb24',
//   },
//   'Feedback/Action/Primary/Icon/Notice/lowContrast/Default': {
//     id: 'S:75ef8ef4f3ef447118a5f740b5119e213926bbb2,',
//     key: '75ef8ef4f3ef447118a5f740b5119e213926bbb2',
//   },
//   'Feedback/Action/Primary/Icon/Notice/lowContrast/Hover': {
//     id: 'S:c95bce13689c067a8cc20aa393484aeee5e03ce1,',
//     key: 'c95bce13689c067a8cc20aa393484aeee5e03ce1',
//   },
//   'Feedback/Action/Primary/Icon/Notice/lowContrast/Focus': {
//     id: 'S:c22dbc2c8d0f6365b9faca87ff930729170bc24c,',
//     key: 'c22dbc2c8d0f6365b9faca87ff930729170bc24c',
//   },
//   'Feedback/Action/Primary/Icon/Notice/lowContrast/Active': {
//     id: 'S:a6a41c55b3708feed71cb40f7d8bea3184c7c161,',
//     key: 'a6a41c55b3708feed71cb40f7d8bea3184c7c161',
//   },
//   'Feedback/Action/Primary/Icon/Notice/lowContrast/Disabled': {
//     id: 'S:73f134bf2fc02e52c68de0c39a4639b42fc57ef5,',
//     key: '73f134bf2fc02e52c68de0c39a4639b42fc57ef5',
//   },
//   'Feedback/Action/Primary/Icon/Notice/highContrast/Default': {
//     id: 'S:597ba3f7e701dea87031f4cbf3d6a6b04ba189d3,',
//     key: '597ba3f7e701dea87031f4cbf3d6a6b04ba189d3',
//   },
//   'Feedback/Action/Primary/Icon/Notice/highContrast/Hover': {
//     id: 'S:3e8920e73d821fa56d2be001e9d4e2263ca0938e,',
//     key: '3e8920e73d821fa56d2be001e9d4e2263ca0938e',
//   },
//   'Feedback/Action/Primary/Icon/Notice/highContrast/Focus': {
//     id: 'S:ab6ea8a3e473a82c7dc0781133a51fe1c99930ec,',
//     key: 'ab6ea8a3e473a82c7dc0781133a51fe1c99930ec',
//   },
//   'Feedback/Action/Primary/Icon/Notice/highContrast/Active': {
//     id: 'S:8f0f38d44685909d80ad4d32bc68bd8beb94f98b,',
//     key: '8f0f38d44685909d80ad4d32bc68bd8beb94f98b',
//   },
//   'Feedback/Action/Primary/Icon/Notice/highContrast/Disabled': {
//     id: 'S:30731439d695ec19fdf9e98954bfe7e42b217680,',
//     key: '30731439d695ec19fdf9e98954bfe7e42b217680',
//   },
//   'Feedback/Action/Primary/Icon/Info/lowContrast/Default': {
//     id: 'S:89e2089154c663b7df96057b5d478231bfd9eb5a,',
//     key: '89e2089154c663b7df96057b5d478231bfd9eb5a',
//   },
//   'Feedback/Action/Primary/Icon/Info/lowContrast/Hover': {
//     id: 'S:b5fa2c6cdcea165cff64abf7191bc942d7cec4d8,',
//     key: 'b5fa2c6cdcea165cff64abf7191bc942d7cec4d8',
//   },
//   'Feedback/Action/Primary/Icon/Info/lowContrast/Focus': {
//     id: 'S:c048cebd9ba5cf7d16559e54e3c5c7faaf56db1b,',
//     key: 'c048cebd9ba5cf7d16559e54e3c5c7faaf56db1b',
//   },
//   'Feedback/Action/Primary/Icon/Info/lowContrast/Active': {
//     id: 'S:e7e1e155e68b5009a050b241e3b44e7e5c5a2c78,',
//     key: 'e7e1e155e68b5009a050b241e3b44e7e5c5a2c78',
//   },
//   'Feedback/Action/Primary/Icon/Info/lowContrast/Disabled': {
//     id: 'S:eec0ede40e541ed749a6ee68b8999ad1ed6e6f10,',
//     key: 'eec0ede40e541ed749a6ee68b8999ad1ed6e6f10',
//   },
//   'Feedback/Action/Primary/Icon/Info/highContrast/Default': {
//     id: 'S:3febfab5c0964af1430dfbcb00d3333fa646c618,',
//     key: '3febfab5c0964af1430dfbcb00d3333fa646c618',
//   },
//   'Feedback/Action/Primary/Icon/Info/highContrast/Hover': {
//     id: 'S:5675e35f047940fd34f90c68c876415bfeda8e3a,',
//     key: '5675e35f047940fd34f90c68c876415bfeda8e3a',
//   },
//   'Feedback/Action/Primary/Icon/Info/highContrast/Focus': {
//     id: 'S:190a5abd3e530ff2940afde8169267c4070f0f94,',
//     key: '190a5abd3e530ff2940afde8169267c4070f0f94',
//   },
//   'Feedback/Action/Primary/Icon/Info/highContrast/Active': {
//     id: 'S:77248c53f78571f0fd410c3e4c9e9c746944c413,',
//     key: '77248c53f78571f0fd410c3e4c9e9c746944c413',
//   },
//   'Feedback/Action/Primary/Icon/Info/highContrast/Disabled': {
//     id: 'S:b718e64797992f3dfaaba09750aef7c65a149b46,',
//     key: 'b718e64797992f3dfaaba09750aef7c65a149b46',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/lowContrast/Default': {
//     id: 'S:959da62f563a034d1a0b51c14f0810f7eb5bebbf,',
//     key: '959da62f563a034d1a0b51c14f0810f7eb5bebbf',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/lowContrast/Hover': {
//     id: 'S:e97d8e4ef2c5d5de895caf41f359f25e68258432,',
//     key: 'e97d8e4ef2c5d5de895caf41f359f25e68258432',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/lowContrast/Focus': {
//     id: 'S:919d773b1ea3e84dc1ce0a60970bf2ad8ce04f96,',
//     key: '919d773b1ea3e84dc1ce0a60970bf2ad8ce04f96',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/lowContrast/Active': {
//     id: 'S:c6f7e90d774e1313caab03374b79b792d3354cbc,',
//     key: 'c6f7e90d774e1313caab03374b79b792d3354cbc',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/lowContrast/Disabled': {
//     id: 'S:6d78c5c56560874e65c416da14dfcad00b3c2eeb,',
//     key: '6d78c5c56560874e65c416da14dfcad00b3c2eeb',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/highContrast/Default': {
//     id: 'S:a7112c10e7d819b7f7cf666c9ae15ab032c6cf3f,',
//     key: 'a7112c10e7d819b7f7cf666c9ae15ab032c6cf3f',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/highContrast/Hover': {
//     id: 'S:2cd766795dda14ef775b6ccbacec88d3e3985c5c,',
//     key: '2cd766795dda14ef775b6ccbacec88d3e3985c5c',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/highContrast/Focus': {
//     id: 'S:a912fcea273f5debc0cc532830e2f6f7665d924f,',
//     key: 'a912fcea273f5debc0cc532830e2f6f7665d924f',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/highContrast/Active': {
//     id: 'S:4712d10f8607764b0d71618b459d6e86ef94a7c3,',
//     key: '4712d10f8607764b0d71618b459d6e86ef94a7c3',
//   },
//   'Feedback/Action/Primary/Icon/Neutral/highContrast/Disabled': {
//     id: 'S:174d53e2c60a938849cb2ed728fccc9174bd1308,',
//     key: '174d53e2c60a938849cb2ed728fccc9174bd1308',
//   },
//   'Feedback/Action/Link/Text/Positive/lowContrast/Default': {
//     id: 'S:47e082a5e206d87098455cd180f9e660ba593c51,',
//     key: '47e082a5e206d87098455cd180f9e660ba593c51',
//   },
//   'Feedback/Action/Link/Text/Positive/lowContrast/Hover': {
//     id: 'S:c90b85450d119e4b89bafeba873a08e11ebf5020,',
//     key: 'c90b85450d119e4b89bafeba873a08e11ebf5020',
//   },
//   'Feedback/Action/Link/Text/Positive/lowContrast/Focus': {
//     id: 'S:8cb06398abbdf07b3ef6be5e574cd379cb37774a,',
//     key: '8cb06398abbdf07b3ef6be5e574cd379cb37774a',
//   },
//   'Feedback/Action/Link/Text/Positive/lowContrast/Active': {
//     id: 'S:f733ad6fdbbf2d208efbfb61f13da1290bc184f5,',
//     key: 'f733ad6fdbbf2d208efbfb61f13da1290bc184f5',
//   },
//   'Feedback/Action/Link/Text/Positive/lowContrast/Disabled': {
//     id: 'S:47fca50638335357d2832c98ab7484f8f7796dff,',
//     key: '47fca50638335357d2832c98ab7484f8f7796dff',
//   },
//   'Feedback/Action/Link/Text/Positive/highContrast/Default': {
//     id: 'S:102fc9027fe89510b7ae270eeb29be1f07e4e1fb,',
//     key: '102fc9027fe89510b7ae270eeb29be1f07e4e1fb',
//   },
//   'Feedback/Action/Link/Text/Positive/highContrast/Hover': {
//     id: 'S:72e18a63a427a0e9eb67bd4775e55338358fa05e,',
//     key: '72e18a63a427a0e9eb67bd4775e55338358fa05e',
//   },
//   'Feedback/Action/Link/Text/Positive/highContrast/Focus': {
//     id: 'S:45f39b26aeee6fb38d816813887cf6ca39a2f6f7,',
//     key: '45f39b26aeee6fb38d816813887cf6ca39a2f6f7',
//   },
//   'Feedback/Action/Link/Text/Positive/highContrast/Active': {
//     id: 'S:3fee56ab38eb4fd2ed2a3257fbd22839f3e46b0e,',
//     key: '3fee56ab38eb4fd2ed2a3257fbd22839f3e46b0e',
//   },
//   'Feedback/Action/Link/Text/Positive/highContrast/Disabled': {
//     id: 'S:3c4bce0ee46506fd5201395cba9cdbc4801d37f8,',
//     key: '3c4bce0ee46506fd5201395cba9cdbc4801d37f8',
//   },
//   'Feedback/Action/Link/Text/Negative/lowContrast/Default': {
//     id: 'S:cb1faa7256963273c0c55ba371d49d76b92bee83,',
//     key: 'cb1faa7256963273c0c55ba371d49d76b92bee83',
//   },
//   'Feedback/Action/Link/Text/Negative/lowContrast/Hover': {
//     id: 'S:406da4297730328f8e25ce404251d0a55fa9e546,',
//     key: '406da4297730328f8e25ce404251d0a55fa9e546',
//   },
//   'Feedback/Action/Link/Text/Negative/lowContrast/Focus': {
//     id: 'S:aafef00ca908ad1bf35be1ca015182194baaf03c,',
//     key: 'aafef00ca908ad1bf35be1ca015182194baaf03c',
//   },
//   'Feedback/Action/Link/Text/Negative/lowContrast/Active': {
//     id: 'S:842e9af7a546a58d434e6c9e0d3af5f9245d847c,',
//     key: '842e9af7a546a58d434e6c9e0d3af5f9245d847c',
//   },
//   'Feedback/Action/Link/Text/Negative/lowContrast/Disabled': {
//     id: 'S:10de30dc8a977401587ebf8f0c5bb00804e3b1f1,',
//     key: '10de30dc8a977401587ebf8f0c5bb00804e3b1f1',
//   },
//   'Feedback/Action/Link/Text/Negative/highContrast/Default': {
//     id: 'S:1b3ddd2c69cf8b15d729d25629fab04398079b68,',
//     key: '1b3ddd2c69cf8b15d729d25629fab04398079b68',
//   },
//   'Feedback/Action/Link/Text/Negative/highContrast/Hover': {
//     id: 'S:ae2cf439aced18b3bcb23af2811a352d3936c279,',
//     key: 'ae2cf439aced18b3bcb23af2811a352d3936c279',
//   },
//   'Feedback/Action/Link/Text/Negative/highContrast/Focus': {
//     id: 'S:73e0712e838c567f4800abb6c4f3435d2103c8a1,',
//     key: '73e0712e838c567f4800abb6c4f3435d2103c8a1',
//   },
//   'Feedback/Action/Link/Text/Negative/highContrast/Active': {
//     id: 'S:a65ffe5ac731539ff0616ee89eb59434c43bcad8,',
//     key: 'a65ffe5ac731539ff0616ee89eb59434c43bcad8',
//   },
//   'Feedback/Action/Link/Text/Negative/highContrast/Disabled': {
//     id: 'S:011a3a9a5b05e194643cce9372289c6b6027080f,',
//     key: '011a3a9a5b05e194643cce9372289c6b6027080f',
//   },
//   'Feedback/Action/Link/Text/Notice/lowContrast/Default': {
//     id: 'S:ea4babc70006be0eabcefd0733501df711c145aa,',
//     key: 'ea4babc70006be0eabcefd0733501df711c145aa',
//   },
//   'Feedback/Action/Link/Text/Notice/lowContrast/Hover': {
//     id: 'S:49620fd4f5acda699879bda88c67655865300106,',
//     key: '49620fd4f5acda699879bda88c67655865300106',
//   },
//   'Feedback/Action/Link/Text/Notice/lowContrast/Focus': {
//     id: 'S:7c1832005aeab58789a49263692fa91530966b5a,',
//     key: '7c1832005aeab58789a49263692fa91530966b5a',
//   },
//   'Feedback/Action/Link/Text/Notice/lowContrast/Active': {
//     id: 'S:4c1b1bed46acaf63bca5d8e3053eb4ca023d6f9c,',
//     key: '4c1b1bed46acaf63bca5d8e3053eb4ca023d6f9c',
//   },
//   'Feedback/Action/Link/Text/Notice/lowContrast/Disabled': {
//     id: 'S:24353d0089600671c041a7ba03b6a4a1929925da,',
//     key: '24353d0089600671c041a7ba03b6a4a1929925da',
//   },
//   'Feedback/Action/Link/Text/Notice/highContrast/Default': {
//     id: 'S:f05c41fa4fe89ee2cf44d3b3914dc27f5bd1fa7a,',
//     key: 'f05c41fa4fe89ee2cf44d3b3914dc27f5bd1fa7a',
//   },
//   'Feedback/Action/Link/Text/Notice/highContrast/Hover': {
//     id: 'S:46b45cf877934757a8540b008f3514b926351b2f,',
//     key: '46b45cf877934757a8540b008f3514b926351b2f',
//   },
//   'Feedback/Action/Link/Text/Notice/highContrast/Focus': {
//     id: 'S:47d4e61f6f110a331b57031356644ac2dafba513,',
//     key: '47d4e61f6f110a331b57031356644ac2dafba513',
//   },
//   'Feedback/Action/Link/Text/Notice/highContrast/Active': {
//     id: 'S:7eb860de1d1ac0f1c331eced3bcb460216f17495,',
//     key: '7eb860de1d1ac0f1c331eced3bcb460216f17495',
//   },
//   'Feedback/Action/Link/Text/Notice/highContrast/Disabled': {
//     id: 'S:301ddba7ce19f322ca21157010282a5f8f9d728a,',
//     key: '301ddba7ce19f322ca21157010282a5f8f9d728a',
//   },
//   'Feedback/Action/Link/Text/Info/lowContrast/Default': {
//     id: 'S:4ba33130431b56f02cba9086a7d88d69bc2be275,',
//     key: '4ba33130431b56f02cba9086a7d88d69bc2be275',
//   },
//   'Feedback/Action/Link/Text/Info/lowContrast/Hover': {
//     id: 'S:e408e7169748b602bd5a4b9b6abd58874d5e3cac,',
//     key: 'e408e7169748b602bd5a4b9b6abd58874d5e3cac',
//   },
//   'Feedback/Action/Link/Text/Info/lowContrast/Focus': {
//     id: 'S:1111aa5859ca7444c241a5bd713aca427d78c9c1,',
//     key: '1111aa5859ca7444c241a5bd713aca427d78c9c1',
//   },
//   'Feedback/Action/Link/Text/Info/lowContrast/Active': {
//     id: 'S:472bdb480ace2fbc0dd6876ba89155a272930a17,',
//     key: '472bdb480ace2fbc0dd6876ba89155a272930a17',
//   },
//   'Feedback/Action/Link/Text/Info/lowContrast/Disabled': {
//     id: 'S:32d89daf9a1e20bfa4bc37ad78d3fa50a0f50476,',
//     key: '32d89daf9a1e20bfa4bc37ad78d3fa50a0f50476',
//   },
//   'Feedback/Action/Link/Text/Info/highContrast/Default': {
//     id: 'S:eff68fa403cb1b60941efe9c5e74cdd2b6808b54,',
//     key: 'eff68fa403cb1b60941efe9c5e74cdd2b6808b54',
//   },
//   'Feedback/Action/Link/Text/Info/highContrast/Hover': {
//     id: 'S:6e6f5f1b5d5d97d86d4c797791a5c33f2b18e876,',
//     key: '6e6f5f1b5d5d97d86d4c797791a5c33f2b18e876',
//   },
//   'Feedback/Action/Link/Text/Info/highContrast/Focus': {
//     id: 'S:0b199e62cd0f2f3bfa0e9421712d248ac603a4e1,',
//     key: '0b199e62cd0f2f3bfa0e9421712d248ac603a4e1',
//   },
//   'Feedback/Action/Link/Text/Info/highContrast/Active': {
//     id: 'S:dda526967a404a78fda83ba379d2237ac665bc4a,',
//     key: 'dda526967a404a78fda83ba379d2237ac665bc4a',
//   },
//   'Feedback/Action/Link/Text/Info/highContrast/Disabled': {
//     id: 'S:1cb30218f5056613585e3c454ea83ebecce8f7fa,',
//     key: '1cb30218f5056613585e3c454ea83ebecce8f7fa',
//   },
//   'Feedback/Action/Link/Text/Neutral/lowContrast/Default': {
//     id: 'S:4aa10194b50b58ce53fe57a648536d181f7b25ae,',
//     key: '4aa10194b50b58ce53fe57a648536d181f7b25ae',
//   },
//   'Feedback/Action/Link/Text/Neutral/lowContrast/Hover': {
//     id: 'S:e815ed59a0e9cd98155ea60e0424ab8a939d6c48,',
//     key: 'e815ed59a0e9cd98155ea60e0424ab8a939d6c48',
//   },
//   'Feedback/Action/Link/Text/Neutral/lowContrast/Focus': {
//     id: 'S:85143c482a73e1971f9aace978218d3fac3dfaf9,',
//     key: '85143c482a73e1971f9aace978218d3fac3dfaf9',
//   },
//   'Feedback/Action/Link/Text/Neutral/lowContrast/Active': {
//     id: 'S:508b0da2cdee5d0a78577f57d526115aca6ea7c2,',
//     key: '508b0da2cdee5d0a78577f57d526115aca6ea7c2',
//   },
//   'Feedback/Action/Link/Text/Neutral/lowContrast/Disabled': {
//     id: 'S:4fec8cecfc7c1603e8b7ede76b2b28216d2355a2,',
//     key: '4fec8cecfc7c1603e8b7ede76b2b28216d2355a2',
//   },
//   'Feedback/Action/Link/Text/Neutral/highContrast/Default': {
//     id: 'S:0d65bf8a7dfd8fd0920f1807d7fb9659d5fe91b2,',
//     key: '0d65bf8a7dfd8fd0920f1807d7fb9659d5fe91b2',
//   },
//   'Feedback/Action/Link/Text/Neutral/highContrast/Hover': {
//     id: 'S:8098149452c9064413e438d3e1640afeb65b1ef0,',
//     key: '8098149452c9064413e438d3e1640afeb65b1ef0',
//   },
//   'Feedback/Action/Link/Text/Neutral/highContrast/Focus': {
//     id: 'S:e07de1726db9e12cceda1ad985dc486c6c92c7c0,',
//     key: 'e07de1726db9e12cceda1ad985dc486c6c92c7c0',
//   },
//   'Feedback/Action/Link/Text/Neutral/highContrast/Active': {
//     id: 'S:1dc8cf3943baf5dad60eeab4a24df4fa5759874f,',
//     key: '1dc8cf3943baf5dad60eeab4a24df4fa5759874f',
//   },
//   'Feedback/Action/Link/Text/Neutral/highContrast/Disabled': {
//     id: 'S:08caee145149227103159c82d1031530248daacf,',
//     key: '08caee145149227103159c82d1031530248daacf',
//   },
//   'Feedback/Action/Link/Icon/Positive/lowContrast/Default': {
//     id: 'S:cc4cb1d8b9345bb19e7d2b4d16b0749c0a3ead4b,',
//     key: 'cc4cb1d8b9345bb19e7d2b4d16b0749c0a3ead4b',
//   },
//   'Feedback/Action/Link/Icon/Positive/lowContrast/Hover': {
//     id: 'S:e343ebd7162a13e9b84bdf2091c701eb3ab168e3,',
//     key: 'e343ebd7162a13e9b84bdf2091c701eb3ab168e3',
//   },
//   'Feedback/Action/Link/Icon/Positive/lowContrast/Focus': {
//     id: 'S:6cde4fdf6972081972e032a90cc4d08bb4c26061,',
//     key: '6cde4fdf6972081972e032a90cc4d08bb4c26061',
//   },
//   'Feedback/Action/Link/Icon/Positive/lowContrast/Active': {
//     id: 'S:cb19e3856ac4e1a8eac625a0a01426471b9f6d6b,',
//     key: 'cb19e3856ac4e1a8eac625a0a01426471b9f6d6b',
//   },
//   'Feedback/Action/Link/Icon/Positive/lowContrast/Disabled': {
//     id: 'S:973af24adc3298a2a6f075fe2f69174260a0e35c,',
//     key: '973af24adc3298a2a6f075fe2f69174260a0e35c',
//   },
//   'Feedback/Action/Link/Icon/Positive/highContrast/Default': {
//     id: 'S:5c206a3ba9ef7707b4b15ab13d13fc694b80a28b,',
//     key: '5c206a3ba9ef7707b4b15ab13d13fc694b80a28b',
//   },
//   'Feedback/Action/Link/Icon/Positive/highContrast/Hover': {
//     id: 'S:1685e34c68c1301db7af72bf29d8c70fdd702dda,',
//     key: '1685e34c68c1301db7af72bf29d8c70fdd702dda',
//   },
//   'Feedback/Action/Link/Icon/Positive/highContrast/Focus': {
//     id: 'S:6b9eabfefe2819d2e5464228b10fcf3f39ee48c6,',
//     key: '6b9eabfefe2819d2e5464228b10fcf3f39ee48c6',
//   },
//   'Feedback/Action/Link/Icon/Positive/highContrast/Active': {
//     id: 'S:9a3bdff9be89389d7c1a6e9d20534a8479f764ed,',
//     key: '9a3bdff9be89389d7c1a6e9d20534a8479f764ed',
//   },
//   'Feedback/Action/Link/Icon/Positive/highContrast/Disabled': {
//     id: 'S:c89470ebcf49203fd83c8628fb1d08c45f30ba77,',
//     key: 'c89470ebcf49203fd83c8628fb1d08c45f30ba77',
//   },
//   'Feedback/Action/Link/Icon/Negative/lowContrast/Default': {
//     id: 'S:ceab5639551c0aeb288243f009efbf491a13dd7b,',
//     key: 'ceab5639551c0aeb288243f009efbf491a13dd7b',
//   },
//   'Feedback/Action/Link/Icon/Negative/lowContrast/Hover': {
//     id: 'S:710b59642932e38c865bc21274d0410f1d1bae72,',
//     key: '710b59642932e38c865bc21274d0410f1d1bae72',
//   },
//   'Feedback/Action/Link/Icon/Negative/lowContrast/Focus': {
//     id: 'S:743da634d7e5310fa54da3526aafef21efa4e1af,',
//     key: '743da634d7e5310fa54da3526aafef21efa4e1af',
//   },
//   'Feedback/Action/Link/Icon/Negative/lowContrast/Active': {
//     id: 'S:c8a24f8f49efcdff7e8cadb0705e44d9c403193e,',
//     key: 'c8a24f8f49efcdff7e8cadb0705e44d9c403193e',
//   },
//   'Feedback/Action/Link/Icon/Negative/lowContrast/Disabled': {
//     id: 'S:ae4e39870cb99f94934d454a0aa8b767d7a6d6ca,',
//     key: 'ae4e39870cb99f94934d454a0aa8b767d7a6d6ca',
//   },
//   'Feedback/Action/Link/Icon/Negative/highContrast/Default': {
//     id: 'S:27404ea3d4e6df7cafb503ddd1ecbef8cb8b679a,',
//     key: '27404ea3d4e6df7cafb503ddd1ecbef8cb8b679a',
//   },
//   'Feedback/Action/Link/Icon/Negative/highContrast/Hover': {
//     id: 'S:edb84f64608671bc077e420a978537e6cc89b645,',
//     key: 'edb84f64608671bc077e420a978537e6cc89b645',
//   },
//   'Feedback/Action/Link/Icon/Negative/highContrast/Focus': {
//     id: 'S:8808298d72ae359472056111e4b82c4b4938dcb5,',
//     key: '8808298d72ae359472056111e4b82c4b4938dcb5',
//   },
//   'Feedback/Action/Link/Icon/Negative/highContrast/Active': {
//     id: 'S:f35f5382de3da8f952128697d03c28c05deb4906,',
//     key: 'f35f5382de3da8f952128697d03c28c05deb4906',
//   },
//   'Feedback/Action/Link/Icon/Negative/highContrast/Disabled': {
//     id: 'S:bf1aa034d047b1f1ff02a522de671f27546678f2,',
//     key: 'bf1aa034d047b1f1ff02a522de671f27546678f2',
//   },
//   'Feedback/Action/Link/Icon/Notice/lowContrast/Default': {
//     id: 'S:4c12e6a5dd05748dc8d4160f63101b206057c06a,',
//     key: '4c12e6a5dd05748dc8d4160f63101b206057c06a',
//   },
//   'Feedback/Action/Link/Icon/Notice/lowContrast/Hover': {
//     id: 'S:557c7d93f4f0079d60671aace2164ecae368ffef,',
//     key: '557c7d93f4f0079d60671aace2164ecae368ffef',
//   },
//   'Feedback/Action/Link/Icon/Notice/lowContrast/Focus': {
//     id: 'S:c7c2ecfab9573fa435955e09bc1a9e93de615034,',
//     key: 'c7c2ecfab9573fa435955e09bc1a9e93de615034',
//   },
//   'Feedback/Action/Link/Icon/Notice/lowContrast/Active': {
//     id: 'S:6727aa79fb181b2ba30db705978adff722c7b2ab,',
//     key: '6727aa79fb181b2ba30db705978adff722c7b2ab',
//   },
//   'Feedback/Action/Link/Icon/Notice/lowContrast/Disabled': {
//     id: 'S:6b8c5ceb587ea39b8a7639c8e1ab933dc56f7d08,',
//     key: '6b8c5ceb587ea39b8a7639c8e1ab933dc56f7d08',
//   },
//   'Feedback/Action/Link/Icon/Notice/highContrast/Default': {
//     id: 'S:d0455114494e60515c45fa335253597b2b41b95e,',
//     key: 'd0455114494e60515c45fa335253597b2b41b95e',
//   },
//   'Feedback/Action/Link/Icon/Notice/highContrast/Hover': {
//     id: 'S:c3d26edcf5a1bcb3d2c054258f09cccce5b6773d,',
//     key: 'c3d26edcf5a1bcb3d2c054258f09cccce5b6773d',
//   },
//   'Feedback/Action/Link/Icon/Notice/highContrast/Focus': {
//     id: 'S:39f8ebc9f36e062fb03083fc708c5a4fcc381c21,',
//     key: '39f8ebc9f36e062fb03083fc708c5a4fcc381c21',
//   },
//   'Feedback/Action/Link/Icon/Notice/highContrast/Active': {
//     id: 'S:a302b9ab90859497a7d7913070156dd3473eaa51,',
//     key: 'a302b9ab90859497a7d7913070156dd3473eaa51',
//   },
//   'Feedback/Action/Link/Icon/Notice/highContrast/Disabled': {
//     id: 'S:302c29935006412faf2c57ccd84ef322799e06ad,',
//     key: '302c29935006412faf2c57ccd84ef322799e06ad',
//   },
//   'Feedback/Action/Link/Icon/Info/lowContrast/Default': {
//     id: 'S:2bd14fe7b9052cfa1048734dd4b28047da347aeb,',
//     key: '2bd14fe7b9052cfa1048734dd4b28047da347aeb',
//   },
//   'Feedback/Action/Link/Icon/Info/lowContrast/Hover': {
//     id: 'S:b537ceacbd2cecd0d06061b5e6f3e18335d868f4,',
//     key: 'b537ceacbd2cecd0d06061b5e6f3e18335d868f4',
//   },
//   'Feedback/Action/Link/Icon/Info/lowContrast/Focus': {
//     id: 'S:6df5d50f2ce8530d4bc4a121408c0c8c94c1df65,',
//     key: '6df5d50f2ce8530d4bc4a121408c0c8c94c1df65',
//   },
//   'Feedback/Action/Link/Icon/Info/lowContrast/Active': {
//     id: 'S:5bec1f4052286b47ec4942b3d1a1c71147809b6d,',
//     key: '5bec1f4052286b47ec4942b3d1a1c71147809b6d',
//   },
//   'Feedback/Action/Link/Icon/Info/lowContrast/Disabled': {
//     id: 'S:16d3381f599feb1a0a0677a6952fd3bbc6d7928e,',
//     key: '16d3381f599feb1a0a0677a6952fd3bbc6d7928e',
//   },
//   'Feedback/Action/Link/Icon/Info/highContrast/Default': {
//     id: 'S:ce28cca5237b43a8b313b38ea65349652ce102b2,',
//     key: 'ce28cca5237b43a8b313b38ea65349652ce102b2',
//   },
//   'Feedback/Action/Link/Icon/Info/highContrast/Hover': {
//     id: 'S:16f07a5a644425d55f25de76f857a5525827b8f1,',
//     key: '16f07a5a644425d55f25de76f857a5525827b8f1',
//   },
//   'Feedback/Action/Link/Icon/Info/highContrast/Focus': {
//     id: 'S:7f6862f99432a9360234631e0fe6f013a5fb4108,',
//     key: '7f6862f99432a9360234631e0fe6f013a5fb4108',
//   },
//   'Feedback/Action/Link/Icon/Info/highContrast/Active': {
//     id: 'S:4cda149f6f26d41a7704f76da5264bdb0f8cad40,',
//     key: '4cda149f6f26d41a7704f76da5264bdb0f8cad40',
//   },
//   'Feedback/Action/Link/Icon/Info/highContrast/Disabled': {
//     id: 'S:62fc371b4405febd64f7fa82a3e4b1e2cae4b79e,',
//     key: '62fc371b4405febd64f7fa82a3e4b1e2cae4b79e',
//   },
//   'Feedback/Action/Link/Icon/Neutral/lowContrast/Default': {
//     id: 'S:79ed8666733d58c6e73780bfdd700920f32d90ff,',
//     key: '79ed8666733d58c6e73780bfdd700920f32d90ff',
//   },
//   'Feedback/Action/Link/Icon/Neutral/lowContrast/Hover': {
//     id: 'S:e0b06901e8f402a8d11ebd5307b8e43c72fe53ae,',
//     key: 'e0b06901e8f402a8d11ebd5307b8e43c72fe53ae',
//   },
//   'Feedback/Action/Link/Icon/Neutral/lowContrast/Focus': {
//     id: 'S:7b0c5780db7a763f94342ca1680876ee64a85434,',
//     key: '7b0c5780db7a763f94342ca1680876ee64a85434',
//   },
//   'Feedback/Action/Link/Icon/Neutral/lowContrast/Active': {
//     id: 'S:7ce703909f339fa331874c101c93268d07a6c5fe,',
//     key: '7ce703909f339fa331874c101c93268d07a6c5fe',
//   },
//   'Feedback/Action/Link/Icon/Neutral/lowContrast/Disabled': {
//     id: 'S:5d6d86d961f0d372663c6aeacb243095409f7443,',
//     key: '5d6d86d961f0d372663c6aeacb243095409f7443',
//   },
//   'Feedback/Action/Link/Icon/Neutral/highContrast/Default': {
//     id: 'S:2e7e17e6c654c1a590c96fa93917d981132da8ab,',
//     key: '2e7e17e6c654c1a590c96fa93917d981132da8ab',
//   },
//   'Feedback/Action/Link/Icon/Neutral/highContrast/Hover': {
//     id: 'S:bfbd6350b9af43157709d96b5bfc334facd10df9,',
//     key: 'bfbd6350b9af43157709d96b5bfc334facd10df9',
//   },
//   'Feedback/Action/Link/Icon/Neutral/highContrast/Focus': {
//     id: 'S:aa1e49e8f5302d062ba68ef990036d72da94d819,',
//     key: 'aa1e49e8f5302d062ba68ef990036d72da94d819',
//   },
//   'Feedback/Action/Link/Icon/Neutral/highContrast/Active': {
//     id: 'S:9e4fed8f2fe402b0abf72df31b94d8f9e8ea2b7a,',
//     key: '9e4fed8f2fe402b0abf72df31b94d8f9e8ea2b7a',
//   },
//   'Feedback/Action/Link/Icon/Neutral/highContrast/Disabled': {
//     id: 'S:46329b8c84794bbe8ea474934265d22dd336c504,',
//     key: '46329b8c84794bbe8ea474934265d22dd336c504',
//   },
//   'Action/Primary/Background/lowContrast/Default': {
//     id: 'S:c20340ec0abc94bbf16148fbb63effee59cfd121,',
//     key: 'c20340ec0abc94bbf16148fbb63effee59cfd121',
//   },
//   'Action/Primary/Background/lowContrast/Hover': {
//     id: 'S:bd49cc52373b14a17e909f84585342e8387b7de6,',
//     key: 'bd49cc52373b14a17e909f84585342e8387b7de6',
//   },
//   'Action/Primary/Background/lowContrast/Focus': {
//     id: 'S:52d196a52e4688b92e03afe722535275d538b52f,',
//     key: '52d196a52e4688b92e03afe722535275d538b52f',
//   },
//   'Action/Primary/Background/lowContrast/Active': {
//     id: 'S:cd1c6cacfaaa3d169cdc974eb72a48a8f8a3738a,',
//     key: 'cd1c6cacfaaa3d169cdc974eb72a48a8f8a3738a',
//   },
//   'Action/Primary/Background/lowContrast/Disabled': {
//     id: 'S:4502605a638407c0ecfbdef33e2c928d694d3e35,',
//     key: '4502605a638407c0ecfbdef33e2c928d694d3e35',
//   },
//   'Action/Primary/Border/lowContrast/Default': {
//     id: 'S:91f8182d9ced2c1b5661e473bae7a1ebb47e177f,',
//     key: '91f8182d9ced2c1b5661e473bae7a1ebb47e177f',
//   },
//   'Action/Primary/Border/lowContrast/Hover': {
//     id: 'S:9ca0250ee59ea2941feaaa01314d5e945407a8c6,',
//     key: '9ca0250ee59ea2941feaaa01314d5e945407a8c6',
//   },
//   'Action/Primary/Border/lowContrast/Focus': {
//     id: 'S:ad1303fc541902613a276ac084b80d87dc853899,',
//     key: 'ad1303fc541902613a276ac084b80d87dc853899',
//   },
//   'Action/Primary/Border/lowContrast/Active': {
//     id: 'S:64902ffda0448114fce7bd949b93b3660527f0bc,',
//     key: '64902ffda0448114fce7bd949b93b3660527f0bc',
//   },
//   'Action/Primary/Border/lowContrast/Disabled': {
//     id: 'S:0403a017ad010f20e5cf8c1d1a7f8e11b6f0e63b,',
//     key: '0403a017ad010f20e5cf8c1d1a7f8e11b6f0e63b',
//   },
//   'Action/Primary/Text/lowContrast/Default': {
//     id: 'S:47345b2913fa058249385a3a48def505b43ac735,',
//     key: '47345b2913fa058249385a3a48def505b43ac735',
//   },
//   'Action/Primary/Text/lowContrast/Hover': {
//     id: 'S:2b2baa8f2adae11f2c8fb4686106347eabe6096b,',
//     key: '2b2baa8f2adae11f2c8fb4686106347eabe6096b',
//   },
//   'Action/Primary/Text/lowContrast/Focus': {
//     id: 'S:dd2a279ee05c238cb060356cfdf0bdfff8d4ea14,',
//     key: 'dd2a279ee05c238cb060356cfdf0bdfff8d4ea14',
//   },
//   'Action/Primary/Text/lowContrast/Active': {
//     id: 'S:92a60d89bbe177f1d16378cbd229b0c38bfc9ec5,',
//     key: '92a60d89bbe177f1d16378cbd229b0c38bfc9ec5',
//   },
//   'Action/Primary/Text/lowContrast/Disabled': {
//     id: 'S:8be0e7fb62643c58018eacadf434d083e15aa16e,',
//     key: '8be0e7fb62643c58018eacadf434d083e15aa16e',
//   },
//   'Action/Primary/Icon/lowContrast/Default': {
//     id: 'S:7574a044700998cdcc8f52a98a3145929332eac8,',
//     key: '7574a044700998cdcc8f52a98a3145929332eac8',
//   },
//   'Action/Primary/Icon/lowContrast/Hover': {
//     id: 'S:4bf16226c80a927b5ba9cc9fd79b695080824453,',
//     key: '4bf16226c80a927b5ba9cc9fd79b695080824453',
//   },
//   'Action/Primary/Icon/lowContrast/Focus': {
//     id: 'S:674ae335699734be28fd26883049b594334d2a73,',
//     key: '674ae335699734be28fd26883049b594334d2a73',
//   },
//   'Action/Primary/Icon/lowContrast/Active': {
//     id: 'S:7a070b20b0d9f0c796857fd33b41fbb1c1bcc00e,',
//     key: '7a070b20b0d9f0c796857fd33b41fbb1c1bcc00e',
//   },
//   'Action/Primary/Icon/lowContrast/Disabled': {
//     id: 'S:67ec48b824d0141362922d539c3d806a3658136d,',
//     key: '67ec48b824d0141362922d539c3d806a3658136d',
//   },
//   'Action/Secondary/Background/lowContrast/Default': {
//     id: 'S:23e856c1c1996b48dbcb8e4bb0ea8dd11776be37,',
//     key: '23e856c1c1996b48dbcb8e4bb0ea8dd11776be37',
//   },
//   'Action/Secondary/Background/lowContrast/Hover': {
//     id: 'S:5daf1a33dbc4e19ac4973a932ef01569fdbe61f7,',
//     key: '5daf1a33dbc4e19ac4973a932ef01569fdbe61f7',
//   },
//   'Action/Secondary/Background/lowContrast/Focus': {
//     id: 'S:c7d97c32810175571f796f640ed143bf0e2c8218,',
//     key: 'c7d97c32810175571f796f640ed143bf0e2c8218',
//   },
//   'Action/Secondary/Background/lowContrast/Active': {
//     id: 'S:4077f6fbf5be8b8ad5ca6c1a76ec236c3622bfaa,',
//     key: '4077f6fbf5be8b8ad5ca6c1a76ec236c3622bfaa',
//   },
//   'Action/Secondary/Background/lowContrast/Disabled': {
//     id: 'S:e05b4f528258e404fed4df5f2b6cdac987ed439a,',
//     key: 'e05b4f528258e404fed4df5f2b6cdac987ed439a',
//   },
//   'Action/Secondary/Border/lowContrast/Default': {
//     id: 'S:c4f87f1d0f515405b7996dd3226d566341689880,',
//     key: 'c4f87f1d0f515405b7996dd3226d566341689880',
//   },
//   'Action/Secondary/Border/lowContrast/Hover': {
//     id: 'S:c36e885e0010a8b177a552bbcf1e02b451edeacd,',
//     key: 'c36e885e0010a8b177a552bbcf1e02b451edeacd',
//   },
//   'Action/Secondary/Border/lowContrast/Focus': {
//     id: 'S:5504532ba7581db437f01d2618de735db03f9832,',
//     key: '5504532ba7581db437f01d2618de735db03f9832',
//   },
//   'Action/Secondary/Border/lowContrast/Active': {
//     id: 'S:2da1c6c2e98f0fd3cad6bd199117d69382d02026,',
//     key: '2da1c6c2e98f0fd3cad6bd199117d69382d02026',
//   },
//   'Action/Secondary/Border/lowContrast/Disabled': {
//     id: 'S:bac44a3071455ad324ab1927df8493cc718c457f,',
//     key: 'bac44a3071455ad324ab1927df8493cc718c457f',
//   },
//   'Action/Secondary/Text/lowContrast/Default': {
//     id: 'S:e6c6418f32f68924ec484109ce1124f7fb42772f,',
//     key: 'e6c6418f32f68924ec484109ce1124f7fb42772f',
//   },
//   'Action/Secondary/Text/lowContrast/Hover': {
//     id: 'S:012038afe406ab120035b4ad0d3ffc97461fc7be,',
//     key: '012038afe406ab120035b4ad0d3ffc97461fc7be',
//   },
//   'Action/Secondary/Text/lowContrast/Focus': {
//     id: 'S:17b1ecc77a635c9cc184fdc2aabc7e95e68ab154,',
//     key: '17b1ecc77a635c9cc184fdc2aabc7e95e68ab154',
//   },
//   'Action/Secondary/Text/lowContrast/Active': {
//     id: 'S:594fd7576be22212785cf55d2c85931afd2c5dfd,',
//     key: '594fd7576be22212785cf55d2c85931afd2c5dfd',
//   },
//   'Action/Secondary/Text/lowContrast/Disabled': {
//     id: 'S:eab7e9ca4559c733a021bd6ebd8637c1c8519323,',
//     key: 'eab7e9ca4559c733a021bd6ebd8637c1c8519323',
//   },
//   'Action/Secondary/Icon/lowContrast/Default': {
//     id: 'S:5bd3d6f2490aeae1b882615bd05008f018af178b,',
//     key: '5bd3d6f2490aeae1b882615bd05008f018af178b',
//   },
//   'Action/Secondary/Icon/lowContrast/Hover': {
//     id: 'S:c4bc7389fcf481d1af8e36a1c5794023d44c6574,',
//     key: 'c4bc7389fcf481d1af8e36a1c5794023d44c6574',
//   },
//   'Action/Secondary/Icon/lowContrast/Focus': {
//     id: 'S:a83cc6f27c8767fdbfbb13d47077f57d4793f617,',
//     key: 'a83cc6f27c8767fdbfbb13d47077f57d4793f617',
//   },
//   'Action/Secondary/Icon/lowContrast/Active': {
//     id: 'S:e8d1e847fbd6b54989fd8a85448a160a7450a313,',
//     key: 'e8d1e847fbd6b54989fd8a85448a160a7450a313',
//   },
//   'Action/Secondary/Icon/lowContrast/Disabled': {
//     id: 'S:bfc801e9689cb90f56169ae2b82550ab8011746b,',
//     key: 'bfc801e9689cb90f56169ae2b82550ab8011746b',
//   },
//   'Action/Tertiary/Background/lowContrast/Default': {
//     id: 'S:8d6894163e26e3d5e6d57f05d9e6a7298a927c11,',
//     key: '8d6894163e26e3d5e6d57f05d9e6a7298a927c11',
//   },
//   'Action/Tertiary/Background/lowContrast/Hover': {
//     id: 'S:b10ef1c213448cb0fb3ece9285e2442d95e1dded,',
//     key: 'b10ef1c213448cb0fb3ece9285e2442d95e1dded',
//   },
//   'Action/Tertiary/Background/lowContrast/Focus': {
//     id: 'S:c6d8d5266b8f1ed50cd3e0b563345723ac4144e3,',
//     key: 'c6d8d5266b8f1ed50cd3e0b563345723ac4144e3',
//   },
//   'Action/Tertiary/Background/lowContrast/Active': {
//     id: 'S:fb8e7bdb5dc8bc77b0894779ed2d91507fc78614,',
//     key: 'fb8e7bdb5dc8bc77b0894779ed2d91507fc78614',
//   },
//   'Action/Tertiary/Background/lowContrast/Disabled': {
//     id: 'S:9406b9ab85cd6dad08944b9324d55ce95f26f0ab,',
//     key: '9406b9ab85cd6dad08944b9324d55ce95f26f0ab',
//   },
//   'Action/Tertiary/Border/lowContrast/Default': {
//     id: 'S:e96133225f254850896e31da9535eb453d6af110,',
//     key: 'e96133225f254850896e31da9535eb453d6af110',
//   },
//   'Action/Tertiary/Border/lowContrast/Hover': {
//     id: 'S:7dd8de3b29ff316f24f859a33e3454b72726a6df,',
//     key: '7dd8de3b29ff316f24f859a33e3454b72726a6df',
//   },
//   'Action/Tertiary/Border/lowContrast/Focus': {
//     id: 'S:8b7b6fe4ed78cc9c2392500738b129f516d130f6,',
//     key: '8b7b6fe4ed78cc9c2392500738b129f516d130f6',
//   },
//   'Action/Tertiary/Border/lowContrast/Active': {
//     id: 'S:75c0959b4333f8ee2c68b095cdd7a26175ac7cab,',
//     key: '75c0959b4333f8ee2c68b095cdd7a26175ac7cab',
//   },
//   'Action/Tertiary/Border/lowContrast/Disabled': {
//     id: 'S:fe57e2bd01829ee1ba73f165b1d642129905cfe8,',
//     key: 'fe57e2bd01829ee1ba73f165b1d642129905cfe8',
//   },
//   'Action/Tertiary/Text/lowContrast/Default': {
//     id: 'S:f103fc9d14d1ebf61decc94621d52c19934e2764,',
//     key: 'f103fc9d14d1ebf61decc94621d52c19934e2764',
//   },
//   'Action/Tertiary/Text/lowContrast/Hover': {
//     id: 'S:d8df5c9a855deaf7509a9a13baf24749cb93e087,',
//     key: 'd8df5c9a855deaf7509a9a13baf24749cb93e087',
//   },
//   'Action/Tertiary/Text/lowContrast/Focus': {
//     id: 'S:e669233b4efb13c6d2c177cda760cc7afd53e751,',
//     key: 'e669233b4efb13c6d2c177cda760cc7afd53e751',
//   },
//   'Action/Tertiary/Text/lowContrast/Active': {
//     id: 'S:b852dc6f9d3d970d96538e6d56cd10965ba39fa8,',
//     key: 'b852dc6f9d3d970d96538e6d56cd10965ba39fa8',
//   },
//   'Action/Tertiary/Text/lowContrast/Disabled': {
//     id: 'S:6b449ec12946f96d75c0440a01e7d0ce4b0e348a,',
//     key: '6b449ec12946f96d75c0440a01e7d0ce4b0e348a',
//   },
//   'Action/Tertiary/Icon/lowContrast/Default': {
//     id: 'S:2ad1753d69ed47e8d5b79d76d7011ed49e9e557f,',
//     key: '2ad1753d69ed47e8d5b79d76d7011ed49e9e557f',
//   },
//   'Action/Tertiary/Icon/lowContrast/Hover': {
//     id: 'S:fd0fc1d0db279f887911fc64cfc210621f3d86f7,',
//     key: 'fd0fc1d0db279f887911fc64cfc210621f3d86f7',
//   },
//   'Action/Tertiary/Icon/lowContrast/Focus': {
//     id: 'S:e75f739cd0d492e1d1c32a4afbe7938425127abd,',
//     key: 'e75f739cd0d492e1d1c32a4afbe7938425127abd',
//   },
//   'Action/Tertiary/Icon/lowContrast/Active': {
//     id: 'S:b2d755a9783951de29157906ca5d5b4e8276f3e5,',
//     key: 'b2d755a9783951de29157906ca5d5b4e8276f3e5',
//   },
//   'Action/Tertiary/Icon/lowContrast/Disabled': {
//     id: 'S:0b871e193f2abbb5357c17c1783af7893449e82f,',
//     key: '0b871e193f2abbb5357c17c1783af7893449e82f',
//   },
//   'Action/Link/Text/lowContrast/Default': {
//     id: 'S:b6b980d09e9ebb7a0e2976d0e4e5e8f14bfc4d27,',
//     key: 'b6b980d09e9ebb7a0e2976d0e4e5e8f14bfc4d27',
//   },
//   'Action/Link/Text/lowContrast/Hover': {
//     id: 'S:f9c1320c59d72b39ac1729c7320b0fe141c86610,',
//     key: 'f9c1320c59d72b39ac1729c7320b0fe141c86610',
//   },
//   'Action/Link/Text/lowContrast/Focus': {
//     id: 'S:c005b4bf98c1e5d2fd723c55f1f1e4a1a3975ebe,',
//     key: 'c005b4bf98c1e5d2fd723c55f1f1e4a1a3975ebe',
//   },
//   'Action/Link/Text/lowContrast/Active': {
//     id: 'S:c3e4724ddff67d85bdf35cfa81753d1ad09df9b4,',
//     key: 'c3e4724ddff67d85bdf35cfa81753d1ad09df9b4',
//   },
//   'Action/Link/Text/lowContrast/Disabled': {
//     id: 'S:5567938e19ca7f08c825b67bf5866ae21396996b,',
//     key: '5567938e19ca7f08c825b67bf5866ae21396996b',
//   },
//   'Action/Link/Text/lowContrast/Visited': {
//     id: 'S:9c4af288b79a4bc0ce9467020c1bd5a0b3ae5242,',
//     key: '9c4af288b79a4bc0ce9467020c1bd5a0b3ae5242',
//   },
//   'Action/Link/Icon/lowContrast/Default': {
//     id: 'S:2ed8f13fba7aa2183d90505dc9e75418bf9d7bc3,',
//     key: '2ed8f13fba7aa2183d90505dc9e75418bf9d7bc3',
//   },
//   'Action/Link/Icon/lowContrast/Hover': {
//     id: 'S:086b0d61d3d8a5922ac5b20e37e93f22c5700e4a,',
//     key: '086b0d61d3d8a5922ac5b20e37e93f22c5700e4a',
//   },
//   'Action/Link/Icon/lowContrast/Focus': {
//     id: 'S:650fe7166a7db72003ae6ad16012dabac8619b7c,',
//     key: '650fe7166a7db72003ae6ad16012dabac8619b7c',
//   },
//   'Action/Link/Icon/lowContrast/Active': {
//     id: 'S:c8819aa98644629df45e6ece1f2c75c46050327a,',
//     key: 'c8819aa98644629df45e6ece1f2c75c46050327a',
//   },
//   'Action/Link/Icon/lowContrast/Disabled': {
//     id: 'S:dd17c932a8081b9d78cf0e9a72a0dc1153951ad3,',
//     key: 'dd17c932a8081b9d78cf0e9a72a0dc1153951ad3',
//   },
//   'Action/Link/Icon/lowContrast/Visited': {
//     id: 'S:a0cf15e36fdedcfb39eb19f7474dba4622e35a94,',
//     key: 'a0cf15e36fdedcfb39eb19f7474dba4622e35a94',
//   },
//   '_Custom/Badge/Background/Blue/lowContrast': {
//     id: 'S:73b93c43440af2678bdf1e53487a16c54d880bb3,',
//     key: '73b93c43440af2678bdf1e53487a16c54d880bb3',
//   },
//   '_Custom/Badge/Background/Blue/highContrast': {
//     id: 'S:5ee2b672d1200ee263a27c6f1246c889430f6614,',
//     key: '5ee2b672d1200ee263a27c6f1246c889430f6614',
//   },
//   '_Custom/Badge/Border/Blue/lowContrast': {
//     id: 'S:281c17df672eeac18a54d98e8b744c9943b7c5a1,',
//     key: '281c17df672eeac18a54d98e8b744c9943b7c5a1',
//   },
//   '_Custom/Badge/Border/Blue/highContrast': {
//     id: 'S:d0adfa63b5944dddddff823728b7ce71216b3cf0,',
//     key: 'd0adfa63b5944dddddff823728b7ce71216b3cf0',
//   },
//   '_Custom/Badge/Text/Blue/lowContrast': {
//     id: 'S:916ca0513c7b91daf0ec787c3b107a2a50d22d97,',
//     key: '916ca0513c7b91daf0ec787c3b107a2a50d22d97',
//   },
//   '_Custom/Badge/Text/Blue/highContrast': {
//     id: 'S:404f25a7b7f088bd370dc48bb51fcbc7e6a33814,',
//     key: '404f25a7b7f088bd370dc48bb51fcbc7e6a33814',
//   },
//   '_Custom/Badge/Icon/Blue/lowContrast': {
//     id: 'S:00fc2aff5363995c04bd3aa9374bf833f54bfc40,',
//     key: '00fc2aff5363995c04bd3aa9374bf833f54bfc40',
//   },
//   '_Custom/Badge/Icon/Blue/highContrast': {
//     id: 'S:294f1cac3b8c1abc1b90cc1a376921bd82ec2765,',
//     key: '294f1cac3b8c1abc1b90cc1a376921bd82ec2765',
//   },
// };

// const paymentLightTypographyStyles={}
type CoverageMetrics = {
  bladeComponents: number;
  localComponents: number;
  totalNodes: number;
};

const main = async (): Promise<void> => {
  // once<InsertCodeHandler>('INSERT_CODE', async (code: string) => {
  //   const text = figma.createText();
  //   await loadFontsAsync([text]);
  //   text.characters = code;
  //   figma.currentPage.selection = [text];
  //   figma.viewport.scrollAndZoomIntoView([text]);
  //   figma.closePlugin();
  // });
  const bladeComponentIds = [
    ...Object.keys(paymentLightComponents),
    ...Object.keys(bankingDarkComponents),
  ];
  figma.skipInvisibleInstanceChildren = true;
  // const colorStyles = {};
  // for (const paintStyle of figma.getLocalPaintStyles()) {
  //   colorStyles[paintStyle.name] = {
  //     id: paintStyle.id,
  //     key: paintStyle.key,
  //   };
  // }
  // console.log(colorStyles);
  // return;

  const traverseUpTillMainFrame = (node: BaseNode): BaseNode => {
    if (node !== null) {
      if (getParentNode(node)?.type === 'PAGE') {
        return node;
      } else if (node.parent) {
        return traverseUpTillMainFrame(node.parent);
      }
    }
    return node;
  };

  const renderCoverageCard = async ({
    mainFrameNode,
    bladeComponents,
    localComponents,
    totalNodes,
  }: {
    mainFrameNode: SceneNode;
  } & CoverageMetrics): Promise<void> => {
    // these are from payment light theme but it should work as far as the plugin is being run from Razorpay org
    const COVERAGE_CARD_COMPONENT_KEY = '11bcc47a925ffc86f3cc852fae8495b53af33d82';
    const BLADE_INTENT_COLOR_KEYS = {
      positive: {
        id: '',
        key: 'c61aca5db3a21aead10da4889ad2b31c74d93529',
      },
      negative: {
        id: '',
        key: 'cccac5aac53e828b3be3e8617e462f8ee1a058dd',
      },
      notice: {
        id: '',
        key: '707d5fdfc748a5fc4777d212ee247bc40a86fe85',
      },
    };

    const coverageCardComponent = await figma.importComponentByKeyAsync(
      COVERAGE_CARD_COMPONENT_KEY,
    );
    const coverageCardInstance = coverageCardComponent.createInstance();

    // import styles for popsitive, negative and notice colors and set their id in BLADE_INTENT_COLOR_KEYS
    for await (const [intent, intentObject] of Object.entries(BLADE_INTENT_COLOR_KEYS)) {
      const colorStyle = await figma.importStyleByKeyAsync(intentObject.key);
      BLADE_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorStyle.id;
    }

    const bladeCoverage = Number((bladeComponents / totalNodes) * 100);

    coverageCardInstance.setProperties({
      'bladeCoverage#45061:0': `${bladeCoverage.toFixed(2)}%`,
      'totalLayers#45061:1': totalNodes.toString().padStart(2, '0'),
      'bladeComponents#45061:2': bladeComponents.toString().padStart(2, '0'),
      'localComponents#45061:3': localComponents.toString().padStart(2, '0'),
    });

    traverseNode(coverageCardInstance, (traversedNode) => {
      if (traversedNode.type === 'TEXT' && traversedNode.characters.includes('%')) {
        let coveragePercentageIntent = BLADE_INTENT_COLOR_KEYS.negative.id;
        if (bladeCoverage > 70) {
          coveragePercentageIntent = BLADE_INTENT_COLOR_KEYS.positive.id;
        } else if (bladeCoverage > 50 && bladeCoverage < 70) {
          coveragePercentageIntent = BLADE_INTENT_COLOR_KEYS.notice.id;
        }
        traversedNode.setRangeFillStyleId(
          0,
          traversedNode.characters.length,
          coveragePercentageIntent,
        );
      }
    });

    coverageCardInstance.x = mainFrameNode.x + 150; // 150 because we want to prevent conflict with the frame name
    coverageCardInstance.y = mainFrameNode.y - 100; // 100 is the height of rectangle, can replace with the bounding rect height
  };

  const calculateCoverage = (node: SceneNode): CoverageMetrics | null => {
    let bladeComponents = 0;
    let localComponents = 0;
    let totalNodes = 0;

    if (getParentNode(node)?.type === 'PAGE' && node.type !== 'FRAME') {
      // if there are non-frame nodes as direct children of a page, ignore them
      return null;
    }

    traverseNode(
      node,
      (traversedNode) => {
        if (
          traversedNode.type === 'INSTANCE' &&
          (bladeComponentIds.includes(
            (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
          ) ||
            bladeComponentIds.includes(traversedNode.mainComponent?.key ?? ''))
        ) {
          bladeComponents++;
        } else if (traversedNode.type === 'INSTANCE') {
          localComponents++;
        }
        // exclude the main frame itself from the count to remove false negatives
        if (getParentNode(traversedNode)?.type !== 'PAGE') {
          totalNodes++;
        }
      },
      (traversedNode) => {
        // callback to stopTraversal for children of a node
        // true: we shall stop
        // false: we shall keep traversing children
        if (
          traversedNode.type === 'INSTANCE' &&
          (bladeComponentIds.includes(
            (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
          ) ||
            bladeComponentIds.includes(traversedNode.mainComponent?.key ?? ''))
        ) {
          // we shall stop traversal further if we have found that an instance is Blade instance
          // if we keep traversing then chances are the metrics will be skewed because Blade components are composed of non-blade themselves
          // in code analytics we can add "data-*" to all the children till leaf nodes but over here we can't hence we stop
          return true;
        }
        return false;
      },
    );

    return {
      bladeComponents,
      localComponents,
      totalNodes,
    };
  };

  const getPageMainFrameNodes = (nodes: SceneNode[]): SceneNode[] => {
    const mainFrameNodes: SceneNode[] = [];
    for (const node of nodes) {
      if (getParentNode(node)?.type === 'PAGE') {
        // if selection is top level frame then start the coverage count
        // await calculateCoverage(node);
        mainFrameNodes.push(node);
      } else {
        // if the selection is not the top level frame then traverse up till we find the frame and then start the coverage count
        // await calculateCoverage(mainFrameNode);
        mainFrameNodes.push(traverseUpTillMainFrame(node) as SceneNode);
      }
    }
    return mainFrameNodes;
  };

  let nodes: SceneNode[] = [];
  figma.notify('Calculating Coverage', { timeout: Infinity });
  if (figma.currentPage.selection.length > 0) {
    // you already have the selection, run the plugin
    //@ts-expect-error type 'readonly SceneNode[]' is 'readonly' and cannot be assigned to the mutable type 'SceneNode[]'
    nodes = figma.currentPage.selection;
  } else if (figma.currentPage.type === 'PAGE') {
    // plugin is run from page scope but has no selection, so traverse all the nodes and then measure coverage
    nodes = getSelectedNodesOrAllNodes();
  } else {
    // the plugin is not run from a page scope, throw error
    console.error('Please run the plugin by opening a Page or selecting a layer inside a Page');
  }

  if (nodes.length) {
    // 1. get the main frame nodes of the current page(ignoring non-frame nodes)
    const mainFrameNodes = getPageMainFrameNodes(nodes);
    for await (const mainFrameNode of mainFrameNodes) {
      // 2. calculate the coverage
      const coverageMetrics = calculateCoverage(mainFrameNode);
      if (coverageMetrics) {
        // 3. render the coverage card. fin.
        await renderCoverageCard({ mainFrameNode, ...coverageMetrics });
      }
    }
  }

  figma.closePlugin();
};

export default main;

// S:bb2333acdadcd6bceed353585174c9165cca7bc7,9893:20
// S:bb2333acdadcd6bceed353585174c9165cca7bc7,9893:20
// S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6
// S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6

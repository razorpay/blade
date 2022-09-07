---
"@razorpay/blade": minor
---

feat(TextInput): add TextInput Field

### This release publishes **`TextField`** Input

#### [Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A210737)

#### Capabilities
* Support for various `type` of TextInput i.e `'text' | 'telephone' | 'email' | 'url' | 'numeric' | 'search'`
* Automatically decide `keyboardType`, `keyboardReturnKeyType`, `autoCompleteSuggestionType` based on `type` attribute alone 

![image](https://user-images.githubusercontent.com/11384858/188391913-d45e40b4-1b92-4fab-8bf8-8d49891929f8.png)


* Max characters to be accepted by the input field which will in turn also render a counter
![image](https://user-images.githubusercontent.com/11384858/188390436-2854807d-5fb0-42de-8171-3ba61be4b9f6.png)

* Clear the content of the input field with the help of a clear button
![image](https://user-images.githubusercontent.com/11384858/188391183-8e262200-7424-4a80-a5fe-1c7166be26ce.png)

* Attach `prefix` and `suffix` to the input field
* Fully Accessible



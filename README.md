# Firebase Channel

Firebase channel for Kadira Storybooks. This channel can be used when the Storybook Renderer should communicate with the Storybook Manager over the internet. A channel can be created using the `createChannel` function.

```js
import createChannel from '@kadira/storybook-channel-firebase'

const channel = createChannel({
  url: 'https://my-app.firebaseio.com/path/to/ref'
})
```

# MashupRx

### Oups. You found my laboratory. This is not good. More will follow, I promess.

## Structure

The `MashupRx` class is the main one. It orchestrate everything. Starting by creating a `Promptr` for the boot up phase and interact with the user. Once a config path URL is provided, it loads the config then creates an `AssetBank` instance to load all the necessary assets to play.

In the same time, a `Multiplex` instance is created to check is the MIDI keyboards are connected. Until they are ready, it will display a message on the promptr to wait for the ready state.

When both are ready: assets loaded and keyboards ready. The promptr will wait for the user input to start the Mashup.

Now MashupRx start the `Maestro` destroy the promptr to make space for the `SpritePlayer` on stage. Then it grabs the input content from the Multiplex and use the AssetBank to output actions on a stream with the required media. This stream is observed by the `SpritePlayer` and the `AudioPlayer` to trigger the actions.

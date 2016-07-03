# MashupRx

Event driven app.

## The idea

The app must accept events from the keyboard or MidiAPI to trigger an audio sample and/or a video sprite on a channel, an effect like playback control, bitcrush, echo.
When audio is played, only one sample can be played at the time on a single channel, same for video sprite. The output always display the video of the upper layer.

## Procedure

1. Load the config file
2. From the modules used in the config, let's create and link them.

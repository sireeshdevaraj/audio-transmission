[WIP] transmitting audio through web sockets for a very weird use case.

Good Readme is under construction.

# Setup

It takes a considerable amount of time if you are new to setting up self-signed certificates.

We need to expose the localhost server to record it through your mobile.

## Here are some pitfalls:

You cannot use `MediaRecorder` on mobile without `HTTPS`, and we are not going to use a domain for a simple, unusual use case like this.

The best option would be to expose the server with a self-signed certificate. This way, we can at least get a pseudo-HTTPS on our local IP address.

When using `HTTPS`, the browser does not allow communication over `WS`. We need to use `WSS`. Therefore, when creating the server, we are expected to use a self-signed key and certificate on the server as well.

# Use-case

Most people do not prefer using their iPhone or AirPods for recording, but if you don't have a good microphone, they can still provide better voice quality. 

This tool makes it really easy to record from your phone and seamlessly transmit the data to your computer.


# X n O

Tic-tac-toe where each player keeps only 3 marks. Once all three are down, each turn you pick one of your marks and move it to any empty cell. The older rule, where your oldest mark disappears when you place a 4th, is still in Settings.

Play at https://xando.space/

- Same device, against the computer (Easy, Medium, Perfect), or online with a friend through a 5-character room code or link.
- One screen, no scrolling. Rules, analysis and settings open as pop-ups on desktop and bottom sheets on phones.
- Online moves go through public MQTT brokers over secure WebSockets (EMQX, HiveMQ and Mosquitto at the same time), so it works on any network.
- The win screen uses distortion-waves (MIT, vendored as wave.js).

`solver.py` solves every reachable position. With the standard rule, the first player wins by opening on an edge.

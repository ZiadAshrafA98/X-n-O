# X n O

Tic-tac-toe where each player keeps only 3 marks. When you place your 4th mark, your oldest one disappears.

Play on one device, against a perfect computer, or online with a friend through a shared link. Online moves go through public MQTT brokers over secure WebSockets (EMQX, HiveMQ and Mosquitto at the same time), so it works on any network.

solver.py solves every reachable position. With the standard rule, the first player wins by opening on an edge.

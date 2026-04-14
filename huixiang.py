# the initial function
from random import choice as rc, sample as s
h = 25
w = 25

init = ['口']

guests = ['曰', '回', '吅', '㗊', '响', '昌', '唱']

init_room = [[rc(init) for _ in range(w)] for _ in range(h)]

def fill_up_the_room(room, nc, h, w, f):
    indices = [(r, c) for r in range(h) for c in range(w)]
    for r, c in s(indices, int(len(indices) * f)):
        room[r][c] = nc
    return room

fmt = lambda room: '\n'.join(''.join(row) for row in room)

next_room = init_room
print(fmt(init_room))
for g in guests:
    freq = rc([0.05, 0.08, 0.1, 0.15, 0.3])
    next_room = fill_up_the_room(next_room, g, h, w, freq)
    print('\n\n\n')
    print(fmt(next_room))

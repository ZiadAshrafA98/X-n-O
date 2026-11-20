from collections import deque
LINES=[(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
def won(p): s=set(p); return len(p)==3 and any(all(c in s for c in L) for L in LINES)
# state: (mine, theirs) from mover's perspective, tuples oldest-first
def moves(st):
    me,op=st; occ=set(me)|set(op)
    for c in range(9):
        if c in occ: continue
        nm=me+(c,)
        if len(nm)>3: nm=nm[1:]
        yield c,nm,(op,nm)   # next state: opponent to move
start=((),())
seen={start}; q=deque([start]); succ={}; win_now={}
while q:
    s=q.popleft(); lst=[]; w=False
    for c,nm,ns in moves(s):
        if won(nm): w=True; continue
        lst.append(ns)
        if ns not in seen: seen.add(ns); q.append(ns)
    succ[s]=lst; win_now[s]=w
print("reachable states",len(seen))
val={}; dist={}
pred={s:[] for s in seen}
for s,l in succ.items():
    for n in l: pred[n].append(s)
cnt={s:len(succ[s]) for s in seen}
q=deque()
for s in seen:
    if win_now[s]: val[s]='W'; dist[s]=1; q.append(s)
    elif cnt[s]==0: val[s]='L'; dist[s]=0; q.append(s)
while q:
    s=q.popleft()
    for p in pred[s]:
        if p in val: continue
        if val[s]=='L': val[p]='W'; dist[p]=dist[s]+1; q.append(p)
        else:
            cnt[p]-=1
            if cnt[p]==0: val[p]='L'; dist[p]=dist[s]+1; q.append(p)
from collections import Counter
print(Counter(val.get(s,'D') for s in seen))
print("start:",val.get(start,'D'))
# first move analysis
for c,nm,ns in moves(start):
    print("X first",c, "-> O to move:",val.get(ns,'D'))
# after X center, O replies
s1=((),(4,))
for c,nm,ns in moves(s1):
    print("X center, O",c,"-> X to move:",val.get(ns,'D'),dist.get(ns))
# count of states (in reachable set) per depth class where mover can force win
import json
print("start dist",dist[start])
# principal variation: winner picks fastest win, loser slowest loss
s=start; side='X'; line=[]
for i in range(30):
    best=None
    for c,nm,ns in moves(s):
        if won(nm) and val[s]=='W': best=(c,ns,'win'); break
        v=val.get(ns,'D'); d=dist.get(ns,99)
        if val[s]=='W':
            if v=='L' and (best is None or d<best[2]): best=(c,ns,d)
        else:
            if best is None or d>best[2]: best=(c,ns,d)
    line.append((side,best[0])); 
    if best[2]=='win': break
    s=best[1]; side='O' if side=='X' else 'X'
print(line)
# O replies to X edge 1
for c,nm,ns in moves(((),(1,))):
    print("X edge1, O",c,"->",val.get(ns,'D'),dist.get(ns))

forward 20
right 90

getheading
getposition

set color yellow

a = {a: 90, b: -90}

c = a.a

forward c

a.b = 90

right a.b
forward a["b"]

b = [30, 50]

right b[0]

set color green

b.0 = -30
a["b"] = -50

forward b.0
right a.b

set color red

tri = function (a) {
    repeat (3) {
        forward a right a
        }
    }

tri (10)

a = [[45, 0]]

a.push([0, 45])

setposition a[0]
forward 90
penup
setposition a[1]
pendown
forward 90

restart = function () {
   penup
   setposition [0, 0]
   pendown
   }

doit = function (position) {
   penup
   setposition position
   pendown
   forward 90
   }

restart ()

doit(a[0])
doit(a[1])

restart ()

a.each(doit) 
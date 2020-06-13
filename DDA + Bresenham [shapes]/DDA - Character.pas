program dda;

procedure dda(x1, y1, x2, y2: integer);
  var x, y, length, e, dy, dx: double;
  var i: integer;
begin

  DrawLine(x1, y1, x2, y2);

  if (abs(x2 - x1) >= abs(y2 - y1)) then
    length := abs(x2 - x1)
  else
    length := abs(y2 - y1);
  dx := (x2 - x1) / length;
  dy := (y2 - y1) / length;
  
  x := x1 + 0.5 * Sign(dx);
  y := y1 + 0.5 * Sign(dy);

  for i:=1 to length do
  begin
    plot(int(x), int(y));
    x := x + dx;
    y := y + dy;
  end;
end;

begin
  dda(0, 0, 6, 6);
  dda(0, 0, -6, 6);
  dda(0, 0, 0, -11);
  dda(0, -5, -5, -10);
  dda(0, -5, 6, -6);
  dda(-3, -10, 3, -10);
  dda(3, -10, 3, -15);
  dda(3, -15, -3, -15);
  dda(-3, -15, -3, -10);
  dda(-2, -13, -1, -13);
  dda(1, -13, 2, -13);
  dda(-1, -11, 0, -11);
end.
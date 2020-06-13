program secondOctant;

var endX, endY, currX, currY, d : double;

begin
  endX := 5;
  endY := 12;

  DrawLine(0, 0, endX, endY);

  d := 2 * endX - endY;
  
  currX := 0;
  currY := 0;

  while true do
  begin
    plot(int(currX), int(currY));
    
    if currY = endY then Exit;

    if (d >= 0) then
    begin
      currX := currX + 1;
      d := d - 2 * endY;
    end
    
    currY := currY + 1;
    d := d + 2 * endX;
  end;
end.

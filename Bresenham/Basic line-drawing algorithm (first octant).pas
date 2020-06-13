program firstOctant;

var endX, endY, currX, currY, d : double;

begin
  endX := 16;
  endY := 12;

  DrawLine(0, 0, endX, endY);

  d := 2 * endY - endX;
  
  currX := 0;
  currY := 0;

  while true do
  begin
    plot(int(currX), int(currY));
    
    if currX = endX then Exit;

    if (d >= 0) then
    begin
       currY := currY + 1;
       d := d - 2 * endX;
    end
    
    currX := currX + 1;
    d := d + 2 * endY;
  end;
end.

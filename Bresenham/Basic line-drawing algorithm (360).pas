program octant_360;

var endX, endY, currX, currY, d, diffX, diffY : double;
var xInc, yInc, xDec, yDec : boolean;

begin
  endX := -10;
  endY := -15;

  DrawLine(0, 0, endX, endY);

  currX := 0;
  currY := 0;
  xInc := false;
  yInc := false;
  xDec := false;
  yDec := false;

  if (endX >= 0) and (abs(endX) >= abs(endY)) then 
  begin
    // should increment x by 1
    xInc := true;
  end
  else if (endY >= 0) and (abs(endY) >= abs(endX)) then
  begin
    // should increment y by 1
    yInc := true;
  end
  else if (endX <= 0) and (abs(endX) >= abs(endY)) then
  begin
    // should decrement x by 1
    xDec := true;
  end
  else if (endY <= 0) and (abs(endY) >= abs(endX)) then
  begin
    // should decrement y by 1
    yDec := true;
  end;

  diffX := abs(endX);
  diffY := abs(endY);

  if xInc or xDec then
  begin
    d := 2 * diffY - diffX;
  end
  else  
  begin
    d := 2 * diffX - diffY;
  end;

  while true do
  begin
    plot(int(currX), int(currY));
    
    if xInc or xDec then
    begin
      if currX = endX then Exit;
    end
    else
    begin
      if currY = endY then Exit;
    end;

    if (d >= 0) then
    begin
      if xInc or xDec then
      begin
        if endY <= 0 then currY := currY - 1
        else currY := currY + 1;
        d := d - 2 * abs(endX);
      end
      else 
      begin
        if endX <= 0 then currX := currX - 1
        else currX := currX + 1;
        d := d - 2 * abs(endY);
      end;
    end;
    
    if xInc then currX := currX + 1
    else if xDec then currX := currX - 1
    else if yInc then currY := currY + 1
    else currY := currY - 1;

    if xInc or xDec then
    begin
      d := d + 2 * abs(endY);
    end 
    else 
    begin
      d := d + 2 * abs(endX);
    end;
  end;
end.

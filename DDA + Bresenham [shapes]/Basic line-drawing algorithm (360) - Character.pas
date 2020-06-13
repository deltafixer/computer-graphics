program octant_360;

procedure brasenham(startX, startY, endX, endY: double);
  var currX, currY, d, diffX, diffY : double;
  var xInc, yInc, xDec, yDec : boolean;
begin
  DrawLine(startX, startY, endX, endY);

  currX := startX;
  currY := startY;
  xInc := false;
  yInc := false;
  xDec := false;
  yDec := false;

  if ((endX >= startX) and (startY = endY)) or ((endX >= startX) and (abs(endX) >= abs(endY))) then 
  begin
    // should increment x by 1
    xInc := true;
  end
  else if ((endX <= startX) and (startY = endY)) or ((endX <= startX) and ((endX) <= (endY))) then
  begin
    // should decrement x by 1
    xDec := true;
  end
  else if ((endY >= startY) and (startX = endX)) or ((endY >= startY) and (abs(endY) >= abs(endX))) then
  begin
    // should increment y by 1
    yInc := true;
  end
  else if ((endY <= startY) and (startX = endX)) or ((endY <= startY) and ((endY) <= (endX))) then
  begin
    // should decrement y by 1
    yDec := true;
  end;

  diffX := abs(endX - startX);
  diffY := abs(endY - startY);

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
        if endY <> startY then
        begin
          if endY <= startY then currY := currY - 1
          else currY := currY + 1;
        end;
        d := d - 2 * abs(diffX);
      end
      else 
      begin
        if endX <> startX then
        begin 
          if endX <= startX then currX := currX - 1
          else currX := currX + 1;
        end;
        d := d - 2 * abs(diffY);
      end;
    end;
    
    if xInc then currX := currX + 1
    else if xDec then currX := currX - 1
    else if yInc then currY := currY + 1
    else currY := currY - 1;

    if xInc or xDec then
    begin
      d := d + 2 * abs(diffY);
    end 
    else 
    begin
      d := d + 2 * abs(diffX);
    end;
  end;
end;

begin
  brasenham(0, 0, 6, 6);
  brasenham(0, 0, -6, 6);
  brasenham(0, 0, 0, -11);
  brasenham(0, -5, -5, -10);
  brasenham(0, -5, 6, -6);
  brasenham(-3, -10, 3, -10);
  brasenham(3, -10, 3, -15);
  brasenham(3, -15, -3, -15);
  brasenham(-3, -15, -3, -10);
  brasenham(-2, -13, -1, -13);
  brasenham(1, -13, 2, -13);
  brasenham(-1, -11, 0, -11);
end.
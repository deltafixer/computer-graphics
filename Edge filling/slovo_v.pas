program zad1;
var
x: array[1..7] of integer;
y: array[1..7] of integer;
mat: array[1..10] of array[1..10] of integer;
i, j, numberOfCenters: integer;

procedure Fill(i: integer; j:integer);
var counterToEnd, start, startX, startY, endY, k: integer;
begin
    DrawLine(x[i],y[i],x[j],y[j]);
    
    // find vertical limits
    if y[i] > y[j] then
    begin
        startY := y[j];
        endY := y[i];
    end
    else 
    begin 
        startY := y[i];
        endY := y[j];
    end;

    // line is  vertical
    if(x[i] = x[j]) then
    begin
        startX := x[i];
    end
    else
    begin
        k := (y[j] - y[i]) / (x[j] - x[i]);
    end;
        
    for start := startY to (endY - 1) do
    begin
        if(x[i] <> x[j]) then
        begin
            if k <> 0 then
            begin
                startX := x[i] + (start - y[i]) / k;
            end
            else
            begin
                if (x[i] > x[j]) and (y[i] < y[j]) then
                begin
                    startX := x[i] + (start - y[i] + 1) / (-1);
                end
                else
                begin
                    startX := x[j] + (start - y[j] + 1) / (1);
                end;
            end;
        end;

        for counterToEnd:=startX to 10 do
        begin
            // invert and plot
            if mat[counterToEnd][start] = 0 then mat[counterToEnd][start] := 1 else mat[counterToEnd][start] := 0;
            plotEx(counterToEnd, start, mat[counterToEnd][start]);
        end;
    end;
end;

begin           
   numberOfCenters:=7;

   x[1]:=1;
   y[1]:=1;

   x[2]:=3;
   y[2]:=1;
   
   x[3]:=5;
   y[3]:=3;
   
   x[4]:=7;
   y[4]:=1;
   
   x[5]:=9;
   y[5]:=1;
   
   x[6]:=6;
   y[6]:=5;

   x[7]:=4;
   y[7]:=5;

  for i := 1 to numberOfCenters-1 do
     Fill(i, i + 1);
  Fill(1, numberOfCenters)
end.

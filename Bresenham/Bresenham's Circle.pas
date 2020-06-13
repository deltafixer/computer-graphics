program pixel;

var x, y, r, delta, xOffset, yOffset : Double;
begin
    r := 13;
    x := r;
    y := 0;
    xOffset := -5;
    yOffset := 3;
    // D is the mark for the diagonal coordiante
    // V - vertical
    // H - horizontal

    delta := (x - 1) * (x - 1) + (y + 1) * (y + 1) - r * r;
  
    while(x >= y) do
    begin
        // 1st octant and symmetries
        plot(int(x + xOffset), int(y + yOffset));
        plot(int(x + xOffset), int(-y + yOffset));
        plot(int(-x + xOffset), int(y + yOffset));
        plot(int(-x + xOffset), int(-y + yOffset));
        
        // 2nd octant and symmetries
        // consider x's offset to be y's because of symmetry trick
        plot(int(y + xOffset), int(x + yOffset));
        plot(int(y + xOffset), int(-x + yOffset));
        plot(int(-y + xOffset), int(x + yOffset));
        plot(int(-y + xOffset), int(-x + yOffset));
   
        if (delta = 0) then 
            // case 1, take D, down left
            begin
                x := x - 1;
                y := y + 1;
                delta := delta + 2 * (y - x + 1);
            end
            // case 2, D is inside of circle
            else if (delta < 0) then
            begin
                // case 2.1, abs diff leq 0, go V
                if(2 * (delta +  x) - 1 <= 0) then
                begin
                    y := y + 1;
                    delta := delta + 2 * y +1; 
                end
                // case 2.2, abs diff gt 0, go D
                else 
                begin
                    x := x - 1;
                    y := y + 1;
                    delta := delta + 2 * (y - x + 1);
                end
            end
            // case 3, D is out of circle
            else begin
                // case 3.1, abs diff leq 0, go D
                if(2 * (delta - y) - 1 < 0) then
                    begin
                        x := x - 1;
                        y := y + 1;
                        delta := delta + 2 * (y - x + 1);
                    end
                else 
                // case 3.2, abs diff gt 0, go H
                begin
                    x := x - 1;
                    delta := delta - 2 * x + 1;
                end;
        end;
    end;
end.

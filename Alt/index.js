const weekdays_full = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weekdays_short = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
        const MONTHS = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
        function Ordinal(number) {
            if(4 <= number && number <= 20)
                return `${number}th`;
            if(number % 10 == 1)
                return `${number}st`;
            if(number % 10 == 2)
                return `${number}nd`;
            if(number % 10 == 3)
                return `${number}rd`;
            return `${number}th`;
        }
        window.onload = () => {
            CreateMonth("July",2024);
            CreateMonth("August",2024);
            CreateMonth("September",2024);
            CreateMonth("October",2024);
            CreateMonth("November",2024);
            addevent("12-7-2024","15-7-2024","Important date to remember!\nDon't Forget The Pizza!",null)
        }

        function CreateMonth (month, year) {
            month_as_number = new Date(month+'-1-01').getMonth()+1;

            wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");

            container = document.createElement("div");
            container.classList.add("container");

            month_title = document.createElement("div")
            month_title.classList.add("month-title");
            month_title.innerHTML = `${month} ${year}`;

            weekday_wrapper = document.createElement("div")
            weekday_wrapper.classList.add("weekday-wrapper");

            grid_wrapper = document.createElement("div")
            grid_wrapper.classList.add("grid-wrapper");

            day_grid = document.createElement("div")
            day_grid.classList.add("day-grid");

            event_grid = document.createElement("div")
            event_grid.classList.add("event-grid");
            event_grid.setAttribute("event-grid-id",`${month_as_number}-${year}`);

            grid_wrapper.appendChild(day_grid);
            grid_wrapper.appendChild(event_grid);

            wrapper.appendChild(container);
            container.appendChild(month_title);
            container.appendChild(weekday_wrapper);
            container.appendChild(grid_wrapper);

            document.body.appendChild(wrapper);
            for(i=7;i--;) {
                weekday_full = document.createElement("div");
                weekday_short = document.createElement("div");
                weekday_full.classList.add("weekday","full-name");
                weekday_short.classList.add("weekday","short-name");
                weekday_full.innerHTML = weekdays_full[i];
                weekday_short.innerHTML = weekdays_short[i];
                weekday_wrapper.appendChild(weekday_full);
                weekday_wrapper.appendChild(weekday_short);
            }

            offset = new Date(`${month} ${year}`).getDay();
            month_length = new Date(year,month_as_number,0).getDate();
            for(i = month_length + offset; i---offset;) {
                let item = document.createElement("div");
                item.classList.add("day-grid-item");
                item.style.gridArea = `${Math.floor(i/7)+1} / ${i%7+1}`;
                item.setAttribute("date-id", `${i-offset+1}-${month_as_number}-${year}`)
                if(new Date().setHours(0,0,0,0)==new Date(year,month_as_number-1,i-offset+1).setHours(0,0,0,0))
                    item.classList.add('day-grid-item-today');
                item.onclick = e => {
                }
                item_num = document.createElement("div");
                item_num.classList.add("day-grid-item-num");
                item_num.innerHTML = i-offset+1;
                item.appendChild(item_num);
                day_grid.appendChild(item);
            }
            weeksinmonth = Math.ceil((month_length + offset)/7);
            event_grid.style.gridTemplateRows = `repeat(${weeksinmonth * 12}, minmax(0, 1fr))`

        }

        function addevent(startDate, endDate, text, color) {
            eventID = startDate + '-' + endDate;
            [startDay, startMonth, startYear] = startDate.split('-').map(e => Number(e));
            [endDay, endMonth, endYear] = endDate.split('-').map(e => Number(e));
            if(new Date(endYear,endMonth,endDay).setHours(0,0,0,0) < new Date(startYear,startMonth,startDay).setHours(0,0,0,0)) return;
            for(curYear = startYear; curYear <= endYear; curYear++) {
                for(curMonth = (curYear == startYear ? startMonth : 1);
                    curMonth <= (curYear == endYear ? endMonth : 12); curMonth++) { 
                                     
                    eventGrid = document.querySelector(`div[event-grid-id="${curMonth}-${curYear}"]`);
                    if (!eventGrid) return;
                    curDay = 1;
                    if(curYear == startYear && curMonth == startMonth)
                        curDay = startDay;
                    monthLength = new Date(curYear, curMonth, 0).getDate();
                    curMonthEnd = curYear == endYear && curMonth == endMonth ? endDay : monthLength;

                    dayDone = false;
                    while(!dayDone) {
                        dayLeftofWeek = curMonthEnd - curDay < 7 ? curMonthEnd - curDay + 1 : 7 - new Date(curYear, curMonth - 1, curDay).getDay();

                        startDiv = document.querySelector(`div[date-id="${[curDay, curMonth, curYear].join('-')}"]`);

                        if (!startDiv) return;

                        eventDiv = document.createElement("div");
                        eventDiv.setAttribute("event-id",eventID);

                        eventDiv.classList.add("event-grid-item");
                        eventDiv.style.gridColumn = `${startDiv.style.gridColumn * 6 - 5} / span calc(6*${dayLeftofWeek})`;
                        eventDiv.style.gridRow = `${startDiv.style.gridRow * 12 - 7} / span 5`;
                        eventDiv.innerHTML = text.replace(/\n/g, '<br>');
                        eventGrid.appendChild(eventDiv);

                        curDay += dayLeftofWeek;

                        if(curMonthEnd < curDay)
                            dayDone = true;
                    }                       
                }
            }
        }

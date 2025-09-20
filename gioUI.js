/* botones redondos Label */
class GioBoton {
            constructor(parentElement, id, hintText, paragraphText, events = {},forL=null) {
                this.parentElement = parentElement;
                this.id = id;
                this.forL=forL;
                this.hintText = hintText;
                this.paragraphText = paragraphText;
                this.events = events;
                this.element = null;
                this.elementLabelBt=null;
                
                this.init();
            }
            
            init() {
                this.createElement();
                this.attachEvents();
            }
            setFor(st){
          this.elementLabelBt.setAttribute('for',st);
 
              
            }
            
            createElement() {
                const hintContainer = document.createElement('label');
                hintContainer.className = 'giobotonLabel-hints';
                hintContainer.id = this.id;
                 this.elementLabelBt=hintContainer;
                 
                if(this.forL){
  
     this.elementLabelBt.setAttribute('for',this.forL);
                }
                
                hintContainer.innerHTML = `
                    <div class="giobotonLabel-hint" data-position="4">
                        <span class="giobotonLabel-hint-radius"></span>
                        <span class="giobotonLabel-hint-dot">${this.hintText}</span>
                        <div class="giobotonLabel-hint-content giobotonLabel-split-children">
                            <p class="pclasslabelgio">${this.paragraphText}</p>
                        </div>
                    </div>
                `;
                
                this.element = hintContainer;
                this.parentElement.appendChild(hintContainer);
            }
            
            attachEvents() {
                if (this.element) {
                    Object.keys(this.events).forEach(eventName => {
                        this.element.addEventListener(eventName, this.events[eventName]);
                    });
                }
            }
            
            updateHintText(newText) {
                const hintDot = this.element.querySelector('.giobotonLabel-hint-dot');
                if (hintDot) {
                    hintDot.textContent = newText;
                    this.hintText = newText;
                }
            }
            
            updateParagraphText(newText) {
                const paragraph = this.element.querySelector('.giobotonLabel-hint-content p');
                if (paragraph) {
                    paragraph.textContent = newText;
                    this.paragraphText = newText;
                }
            }
            
            remove() {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }
            
            show() {
                if (this.element) {
                    this.element.style.display = 'flex';
                }
            }
            
            hide() {
                if (this.element) {
                    this.element.style.display = 'none';
                }
            }
        }
/* botones redondos label */


/* fechas */

class GioDatePicker {
    constructor(parentElement, datepickerId, labelText, labelError, events = {}, minDate = null, maxDate = null) {
        this.txtFechamin = minDate;
        this.txtFechamax = maxDate;
     
        this.parentElement = typeof parentElement === 'string' ? document.querySelector(parentElement) : parentElement;
        this.datepickerId = datepickerId;
        this.labelText = labelText;
        this.labelError = labelError;
        this.events = events;
        this.minDate = minDate ? this.normalizeDate(minDate) : null;
        this.maxDate = maxDate ? this.normalizeDate(maxDate) : null;

        this.currentDate = new Date();
        this.selectedDate = null;

        this.dateFormatter = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        this.monthYearFormatter = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long'
        });

        this.init();
    }

    normalizeDate(date) {
        if (typeof date === 'string') {
            const parts = date.split(/[-/]/);
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                const newDate = new Date(year, month, day);
                if (!isNaN(newDate)) {
                    return newDate;
                }
            }
        } else if (date instanceof Date && !isNaN(date)) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        return null;
    }

    init() {
        this.createHTML();
        this.setupElements();
        this.setupEventListeners();
        this.renderCalendar();
    }

    createHTML() {
        const wrapper = document.createElement('div');
        const shouldShowErrorLabel = this.minDate !== null || this.maxDate !== null;
        
        wrapper.innerHTML = `
        <div class="giofecha-datepicker-wrapperBox">
            <div class="giofecha-datepicker-wrapper">
                <div class="giofecha-datepicker-input-group giofecha-theme-border-color">
                    <div class="giofecha-calendar-icon-prefix">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <input type="text" id="${this.datepickerId}" placeholder="Seleccionar Fecha" class="giofecha-datepicker-input giofecha-theme-text-color">
                </div>

                <div id="${this.datepickerId}Calendar" class="giofecha-datepicker-calendar-popup giofecha-hidden giofecha-theme-background-dark">
                    <div class="giofecha-datepicker-header giofecha-theme-text-dark">
                        <button class="giofecha-nav-button giofecha-prev-month giofecha-theme-text-dark">&larr;</button>
                        <div class="giofecha-current-month-year"></div>
                        <button class="giofecha-nav-button giofecha-next-month giofecha-theme-text-dark">&rarr;</button>
                    </div>
                    <div class="giofecha-datepicker-weekdays giofecha-theme-inactive-day-color">
                        <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                    </div>
                    <div class="giofecha-datepicker-days giofecha-theme-text-dark"></div>
                </div>
                <label class="giofecha-gioclassposlabeldatpiker">${this.labelText}</label>
                ${shouldShowErrorLabel ? `<label id="${this.datepickerId}Error" class="giofecha-gioclassposlabeldatpikerError" style="display: none;">out of date range min: ${this.txtFechamin} - max: ${this.txtFechamax}</label>` : ''}
                <div id="${this.datepickerId}YearWheelContainer" class="giofecha-datepicker-year-wheel-container">
                    <div class="giofecha-datepicker-year-wheel">
                        <ul id="${this.datepickerId}YearList"></ul>
                    </div>
                </div>
            </div>
        </div>
        `;
        this.parentElement.appendChild(wrapper.firstElementChild);
    }

    setupElements() {
        this.dateInput = document.getElementById(this.datepickerId);
        this.calendarPopup = document.getElementById(this.datepickerId + 'Calendar');
        this.currentMonthYearDisplay = this.calendarPopup.querySelector('.giofecha-current-month-year');
        this.prevMonthBtn = this.calendarPopup.querySelector('.giofecha-prev-month');
        this.nextMonthBtn = this.calendarPopup.querySelector('.giofecha-next-month');
        this.daysGrid = this.calendarPopup.querySelector('.giofecha-datepicker-days');
        this.errorLabel = document.getElementById(this.datepickerId + 'Error');
        this.yearWheelContainer = document.getElementById(this.datepickerId + 'YearWheelContainer');
        this.yearList = document.getElementById(this.datepickerId + 'YearList');
    }

    setupEventListeners() {
        this.dateInput.addEventListener('click', (event) => {
            this.calendarPopup.classList.toggle('giofecha-hidden');
            event.stopPropagation();
        });

        this.dateInput.addEventListener('input', () => {
            const inputValue = this.dateInput.value;
            const dateParts = inputValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
            let isValidInput = false;

            if (dateParts) {
                const day = parseInt(dateParts[1], 10);
                const month = parseInt(dateParts[2], 10) - 1;
                const year = parseInt(dateParts[3], 10);

                const parsedDate = new Date(year, month, day);

                if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month && parsedDate.getDate() === day) {
                    if (this.isDateInRange(parsedDate)) {
                        this.selectedDate = parsedDate;
                        this.currentDate = new Date(this.selectedDate);
                        this.renderCalendar();
                        this.showError(false);
                        isValidInput = true;
                    } else {
                        this.selectedDate = null;
                        this.showError(true);
                    }
                }
            }

            if (!isValidInput && inputValue !== '') {
                this.selectedDate = null;
                this.renderCalendar();
                if (this.minDate !== null || this.maxDate !== null) {
                    this.showError(true);
                }
            } else if (inputValue === '') {
                this.selectedDate = null;
                this.renderCalendar();
                this.showError(false);
            }

            if (this.events.onInput) {
                this.events.onInput(this.dateInput.value, this.selectedDate);
            }
        });

        this.dateInput.addEventListener('change', () => {
            if (this.events.onChange) {
                this.events.onChange(this.dateInput.value, this.selectedDate);
            }
        });

        this.dateInput.addEventListener('blur', () => {
            if (this.events.onBlur) {
                this.events.onBlur(this.dateInput.value, this.selectedDate);
            }
        });

        this.dateInput.addEventListener('focus', () => {
            if (this.events.onFocus) {
                this.events.onFocus(this.dateInput.value, this.selectedDate);
            }
        });

        this.prevMonthBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        this.nextMonthBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        this.currentMonthYearDisplay.addEventListener('click', (event) => {
            this.toggleYearWheel();
            event.stopPropagation();
        });

        this.yearWheelContainer.addEventListener('click', (event) => {
            if (event.target === this.yearWheelContainer) {
                this.toggleYearWheel();  
            }
        });

        document.addEventListener('click', (event) => {
            if (!this.calendarPopup.contains(event.target) && event.target !== this.dateInput && !this.yearWheelContainer.contains(event.target)) {
                this.calendarPopup.classList.add('giofecha-hidden');
                this.yearWheelContainer.classList.remove('giofecha-active');
            }
        });
    }

    isDateInRange(date) {
        if (!date || isNaN(date)) {
            return false;
        }
        
        if (this.minDate === null && this.maxDate === null) {
            return true;
        }
        
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (this.minDate && normalizedDate < this.minDate) {
            return false;
        }
        if (this.maxDate && normalizedDate > this.maxDate) {
            return false;
        }
        
        return true;
    }

    isDateValid(date) {
        return this.isDateInRange(date);
    }

    showError(show) {
        if (this.errorLabel && (this.minDate !== null || this.maxDate !== null)) {
            if (show) {
                this.errorLabel.style.display = "block";
            } else {
                this.errorLabel.style.display = "none";
            }
        }
    }

    renderCalendar() {
        this.daysGrid.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        this.currentMonthYearDisplay.textContent = this.monthYearFormatter.format(this.currentDate);

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = document.createElement('span');
            day.classList.add('giofecha-inactive', 'giofecha-theme-inactive-day-color');
            day.textContent = lastDayOfPrevMonth - i + 1;
            this.daysGrid.appendChild(day);
        }

        for (let i = 1; i <= lastDayOfMonth; i++) {
            const day = document.createElement('span');
            day.textContent = i;

            const dayDate = new Date(year, month, i);
            const isDisabled = !this.isDateInRange(dayDate);

            if (dayDate.toDateString() === new Date().toDateString()) {
                day.classList.add('giofecha-today');
            }

            if (this.selectedDate && dayDate.toDateString() === this.selectedDate.toDateString()) {
                day.classList.add('giofecha-selected', 'giofecha-theme-selected-day-bg', 'giofecha-theme-selected-day-text');
            }

            if (isDisabled) {
                day.classList.add('giofecha-disabled', 'giofecha-theme-inactive-day-color');
            }

            day.addEventListener('click', () => {
                if (isDisabled) {
                    this.showError(true);
                    if (this.events.onOutOfRangeClick) {
                        this.events.onOutOfRangeClick(dayDate, this.dateFormatter.format(dayDate));
                    }
                } else {
                    this.selectedDate = dayDate;
                    this.dateInput.value = this.dateFormatter.format(this.selectedDate);
                    this.renderCalendar();
                    this.calendarPopup.classList.add('giofecha-hidden');
                    this.showError(false);

                    if (this.events.onChange) {
                        this.events.onChange(this.dateInput.value, this.selectedDate);
                    }
                }
            });

            this.daysGrid.appendChild(day);
        }

        const totalCells = firstDayOfMonth + lastDayOfMonth;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            const day = document.createElement('span');
            day.classList.add('giofecha-inactive', 'giofecha-theme-inactive-day-color');
            day.textContent = i;
            this.daysGrid.appendChild(day);
        }
    }

    renderYearWheel() {
        this.yearList.innerHTML = '';
        const currentYear = this.currentDate.getFullYear();
        const startYear = this.minDate ? this.minDate.getFullYear() : currentYear - 100;
        const endYear = this.maxDate ? this.maxDate.getFullYear() : currentYear + 100;

        for (let year = startYear; year <= endYear; year++) {
            const li = document.createElement('li');
            li.textContent = year;
            if (year === currentYear) {
                li.classList.add('giofecha-selected');
            }
            li.addEventListener('click', (event) => {
                this.currentDate.setFullYear(year);
                this.renderCalendar();
                this.toggleYearWheel(); 
                event.stopPropagation();
            });
            this.yearList.appendChild(li);
        }
         
        const selectedYearElement = this.yearList.querySelector('.giofecha-selected');
        if (selectedYearElement) {
            selectedYearElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    toggleYearWheel() {
        if (this.yearWheelContainer.classList.contains('giofecha-active')) {
            this.yearWheelContainer.classList.remove('giofecha-active');
        } else {
            this.renderYearWheel();
            this.yearWheelContainer.classList.add('giofecha-active');
        }
    }

    setValue(value) {
        this.dateInput.value = value;
        this.selectedDate = null; 

        if (value) {
            const parts = value.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                const newDate = new Date(year, month, day);

                if (!isNaN(newDate) && this.isDateInRange(newDate)) {
                    this.selectedDate = newDate;
                    this.currentDate = new Date(year, month, day);
                    this.renderCalendar();
                    this.showError(false);
                } else {
                    this.showError(true);
                }
            }
        } else {
            this.showError(false);
        }
    }

    getValue() {
        return this.dateInput.value;
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    destroy() {
        this.parentElement.innerHTML = '';
    }
}

/* fechas */




/* gio slider float */

  class GioSliderFloat {
    constructor(parentHtml, id, text, min, max, initialValue, step, events = {
        rangeOnchange: null,
        rangeOninput: null,
        numberOnchange: null,
        numberOninput: null
    }) {
        this.events = events;
        this.rangeValue = null;
        this.numberValue = null;

        this.id = id;
        this.min = min;
        this.max = max;
        this.initialValue = initialValue;
        this.text = text;
        this.step = step;
        this.parentHtml = parentHtml;

        this.setupHtml();
        this.parentHtml.appendChild(this.container);
        this.rangeInput = document.getElementById(this.id + "range");
        this.numberInput = document.getElementById(this.id + "number");
        this.valueSpan = document.getElementById(this.id + "span");
        this.setupEvents();
    }

    setupHtml = () => {
        this.container = document.createElement('div');
        this.container.classList.add("giosliderfloat-container");
        this.container.id = this.id + "container";
        let htmlString = `<label for="slider-input" class="giosliderfloat-label"><label>${this.text} : </label><span id="${this.id}span">${this.initialValue}</span></label>
        <input type="range" id="${this.id}range" class="giosliderfloat-range-input giosliderfloat-posinputslider" min="${this.min}" max="${this.max}" step="${this.step}" value="${this.initialValue}">
        <input type="number" id="${this.id}number" class="giosliderfloat-number-input giosliderfloat-posinputsliderinput" min="${this.min}" max="${this.max}" step="${this.step}" value="${this.initialValue}">
        <label class="giosliderfloat-minval-label">min: ${this.min}</label>
        <label class="giosliderfloat-maxval-label">max: ${this.max}</label>`;
        this.container.innerHTML = htmlString;
    }

    setupEvents = () => {
        this.rangeInput.onchange = (event) => {
            this.valueSpan.innerHTML = this.rangeInput.value;
            this.numberInput.value = this.rangeInput.value;
            if (this.events.rangeOnchange) {
                this.events.rangeOnchange(this.rangeInput.value);
            }
            this.rangeValue = this.rangeInput.value;
        }

        this.rangeInput.oninput = () => {
            this.valueSpan.innerHTML = this.rangeInput.value;
            this.numberInput.value = this.rangeInput.value;
            if (this.events.rangeOninput) {
                this.events.rangeOninput(this.rangeInput.value);
            }
            this.rangeValue = this.rangeInput.value;
        }

        this.numberInput.onchange = (event) => {
            this.valueSpan.innerHTML = this.numberInput.value;
            this.rangeInput.value = this.numberInput.value;
            if (this.events.numberOnchange) {
                this.events.numberOnchange(this.numberInput.value);
            }
            this.numberValue = this.numberInput.value;
        }

        this.numberInput.oninput = () => {
            this.valueSpan.innerHTML = this.numberInput.value;
            this.rangeInput.value = this.numberInput.value;
            if (this.events.numberOninput) {
                this.events.numberOninput(this.numberInput.value);
            }
            this.numberValue = this.numberInput.value;
        }
    }

    getValue() {
        return this.rangeInput.value;
    }

    setValue(value) {
        this.rangeInput.value = value;
        this.numberInput.value = value;
        this.valueSpan.innerHTML = value;
        this.rangeValue = value;
        this.numberValue = value;
    }

    setMin(min) {
        this.min = min;
        this.rangeInput.min = min;
        this.numberInput.min = min;
        this.container.querySelector('.giosliderfloat-minval-label').innerHTML = `min: ${min}`;
    }

    setMax(max) {
        this.max = max;
        this.rangeInput.max = max;
        this.numberInput.max = max;
        this.container.querySelector('.giosliderfloat-maxval-label').innerHTML = `max: ${max}`;
    }

    setRange(min, max) {
        this.setMin(min);
        this.setMax(max);
    }

    setText(text) {
        this.text = text;
        this.container.querySelector('.giosliderfloat-label label').innerHTML = text;
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

     



/* gio slider float */



/* gio slider int */

 class GioSliderInt {
    constructor(parentHtml, id, text, min, max, initialValue, step, events = {
        rangeOnchange: null,
        rangeOninput: null,
        numberOnchange: null,
        numberOninput: null
    }) {
        this.events = events;
        this.rangeValue = null;
        this.numberValue = null;

        this.id = id;
        this.min = min;
        this.max = max;
        this.initialValue = initialValue;
        this.text = text;
        this.step = step;
        this.parentHtml = parentHtml;

        this.setupHtml();
        this.parentHtml.appendChild(this.container);
        this.rangeInput = document.getElementById(this.id + "range");
        this.numberInput = document.getElementById(this.id + "number");
        this.valueSpan = document.getElementById(this.id + "span");
        this.setupEvents();
    }

    setupHtml = () => {
        this.container = document.createElement('div');
        this.container.classList.add("giosliderint-container");
        this.container.id = this.id + "container";
        let htmlString = `<label for="slider-input" class="giosliderint-label"><label>${this.text} :  </label><span id="${this.id}span">${this.initialValue}</span></label>
        <input type="range" id="${this.id}range" class="giosliderint-range-input giosliderint-posinputslider" min="${this.min}" max="${this.max}" step="${this.step}" value="${this.initialValue}">
        <input type="number" id="${this.id}number" class="giosliderint-number-input giosliderint-posinputsliderinput" min="${this.min}" max="${this.max}" step="${this.step}" value="${this.initialValue}">
        <label class="giosliderint-minval-label">min: ${this.min}</label>
        <label class="giosliderint-maxval-label">max: ${this.max}</label>`;
        this.container.innerHTML = htmlString;
    }

    setupEvents = () => {
        this.rangeInput.onchange = (event) => {
            this.updateValues(this.rangeInput.value);
            if (this.events.rangeOnchange) {
                this.events.rangeOnchange(parseInt(this.rangeInput.value));
            }
            this.rangeValue = parseInt(this.rangeInput.value);
        }

        this.rangeInput.oninput = () => {
            this.updateValues(this.rangeInput.value);
            if (this.events.rangeOninput) {
                this.events.rangeOninput(parseInt(this.rangeInput.value));
            }
            this.rangeValue = parseInt(this.rangeInput.value);
        }

        this.numberInput.onchange = (event) => {
            let value = parseInt(event.target.value);
            if (isNaN(value)) value = this.min;

            const min = parseInt(this.numberInput.min);
            const max = parseInt(this.numberInput.max);

            if (value < min) {
                value = min;
            } else if (value > max) {
                value = max;
            }

            event.target.value = value;
            this.updateValues(value);
            if (this.events.numberOnchange) {
                this.events.numberOnchange(value);
            }
            this.numberValue = value;
        }

        this.numberInput.oninput = () => {
            this.updateValues(this.numberInput.value);
            if (this.events.numberOninput) {
                this.events.numberOninput(parseInt(this.numberInput.value));
            }
            this.numberValue = parseInt(this.numberInput.value);
        }
    }

    updateValues = (value) => {
        let parsedValue = parseInt(value);
        if (isNaN(parsedValue)) parsedValue = this.min;
        if (parsedValue < parseInt(this.rangeInput.min)) parsedValue = parseInt(this.rangeInput.min);
        if (parsedValue > parseInt(this.rangeInput.max)) parsedValue = parseInt(this.rangeInput.max);

        this.rangeInput.value = parsedValue;
        this.numberInput.value = parsedValue;
        this.valueSpan.textContent = parsedValue;
    }

    updateMinMaxLabels = () => {
        this.container.querySelector('.giosliderint-minval-label').textContent = `min: ${parseInt(this.rangeInput.min)}`;
        this.container.querySelector('.giosliderint-maxval-label').textContent = `max: ${parseInt(this.rangeInput.max)}`;
    }

    getValue() {
        return parseInt(this.rangeInput.value);
    }

    setValue(value) {
        this.updateValues(value);
        this.rangeValue = parseInt(value);
        this.numberValue = parseInt(value);
    }

    setMin(min) {
        this.min = min;
        this.rangeInput.min = min;
        this.numberInput.min = min;
        this.updateMinMaxLabels();
    }

    setMax(max) {
        this.max = max;
        this.rangeInput.max = max;
        this.numberInput.max = max;
        this.updateMinMaxLabels();
    }

    setRange(min, max) {
        this.setMin(min);
        this.setMax(max);
    }

    setText(text) {
        this.text = text;
        this.container.querySelector('.giosliderint-label label').innerHTML = text;
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

/* gio slider int */


/* gio toggle */
class GioToggle {
    constructor(parentHtml, toggleId, spanText, descripcion, associatedEvents = {}) {
        this.parentHtml = parentHtml;
        this.toggleId = toggleId;
        this.spanText = spanText;
        this.descripcion = descripcion;
        this.associatedEvents = associatedEvents;
        this.element = null;
        this.checkbox = null;
        this.textElement = null;
        this.popupElement = null;

        this.createToggle();
        this.addEvents();
    }

    createToggle() {
        const divContainer = document.createElement('div');
        divContainer.id = this.toggleId + "container";
        divContainer.className = 'giotoggle-divcontainertooggle';

        const st = `<span class="giotoggle-pospantoggle" id="${this.toggleId}Text" data-full-text="${this.spanText}">
                        ${this.spanText}
                    </span>
                    <label>
                        <input id="${this.toggleId}" type="checkbox" class="giotoggle-checkbox">
                        <div class="giotoggle-switch"></div>
                    </label>`;
        divContainer.innerHTML = st;

        this.parentHtml.appendChild(divContainer);

        this.element = divContainer;
        this.checkbox = document.getElementById(this.toggleId);
        this.textElement = document.getElementById(this.toggleId + "Text");

        this.popupElement = document.createElement('div');
        this.popupElement.className = 'giotoggle-popup';
        this.popupElement.id = `${this.toggleId}-popup`;
        document.body.appendChild(this.popupElement);
    }

    addEvents() {
        if (this.checkbox) {
            for (const eventType in this.associatedEvents) {
                if (Object.hasOwnProperty.call(this.associatedEvents, eventType)) {
                    this.checkbox.addEventListener(eventType, this.associatedEvents[eventType]);
                }
            }
        }

        if (this.textElement && this.popupElement) {
            this.textElement.addEventListener('mouseenter', () => this.showPopup());
            this.textElement.addEventListener('mouseleave', () => this.hidePopup());
            this.popupElement.addEventListener('mouseleave', () => this.hidePopup());
        }
    }

    showPopup() {
        const fullText = this.descripcion;
        if (fullText) {
            this.popupElement.textContent = fullText;

            const spanRect = this.textElement.getBoundingClientRect();
            const bodyRect = document.body.getBoundingClientRect();

            this.popupElement.style.top =  `${spanRect.top + window.scrollY - this.popupElement.offsetHeight - 8-76}px`;
            this.popupElement.style.left = `${spanRect.left + window.scrollX}px`;
            this.popupElement.style.display = 'block';
        }
    }

    hidePopup() {
        setTimeout(() => {
            if (!this.popupElement.matches(':hover') && !this.textElement.matches(':hover')) {
                this.popupElement.style.display = 'none';
            }
        }, 100);
    }

    isChecked() {
        return this.checkbox ? this.checkbox.checked : false;
    }

    setChecked(value) {
        if (this.checkbox) {
            this.checkbox.checked = value;
        }
    }

    setText(st) {
        if (this.textElement) {
            this.textElement.textContent = st;
            this.textElement.setAttribute('data-full-text', st);
        }
    }

    getToggleElement() {
        return this.element;
    }

    getCheckboxElement() {
        return this.checkbox;
    }
}
/* gio toggle */


/* checbox */

        class GioChecbox {
            constructor(parentId, checkboxId, initialText, eventHandlers = {}) {
                this.parentElement = parentId;
                this.checkboxId = checkboxId;
                this.initialText = initialText;
                this.isChecked = false;
                this.eventHandlers = eventHandlers;
                this.init();
            }

            init() {
                this.createCheckbox();
                this.bindEvents();
            }

            createCheckbox() {
                this.container = document.createElement('div');
                this.container.className = 'gioClContainerCheckbox';

                this.label = document.createElement('label');
                this.label.className = 'gioClLabelCheckbox gioClRedCheckbox';

                this.input = document.createElement('input');
                this.input.type = 'checkbox';
                this.input.id = this.checkboxId;
                this.input.className = 'gioClInputCheckbox';

                this.wrapper = document.createElement('div');
                this.wrapper.className = 'gioClWrapperCheckbox';

                this.background = document.createElement('div');
                this.background.className = 'gioClBgCheckbox';

                this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                this.svg.setAttribute('class', 'gioClIconCheckbox');
                this.svg.setAttribute('viewBox', '0 0 24 24');
                this.svg.setAttribute('fill', 'none');

                this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                this.path.setAttribute('class', 'gioClPathCheckbox');
                this.path.setAttribute('d', 'M4 12L10 18L20 6');
                this.path.setAttribute('stroke', 'currentColor');
                this.path.setAttribute('stroke-width', '3');
                this.path.setAttribute('stroke-linecap', 'round');
                this.path.setAttribute('stroke-linejoin', 'round');

                this.textSpan = document.createElement('span');
                this.textSpan.className = 'gioClTextCheckbox';
                this.textSpan.textContent = this.initialText;

                this.svg.appendChild(this.path);
                this.wrapper.appendChild(this.background);
                this.wrapper.appendChild(this.svg);
                this.label.appendChild(this.input);
                this.label.appendChild(this.wrapper);
                this.label.appendChild(this.textSpan);
                this.container.appendChild(this.label);

                this.parentElement.appendChild(this.container);
            }

            bindEvents() {
                if (this.eventHandlers.onChange) {
                    this.input.addEventListener('change', (event) => {
                        this.isChecked = event.target.checked;
                        this.eventHandlers.onChange(event, this.isChecked);
                    });
                }

                if (this.eventHandlers.onInput) {
                    this.input.addEventListener('input', (event) => {
                        this.eventHandlers.onInput(event, this.isChecked);
                    });
                }

                if (this.eventHandlers.onClick) {
                    this.input.addEventListener('click', (event) => {
                        this.eventHandlers.onClick(event, this.isChecked);
                    });
                }

                if (this.eventHandlers.onFocus) {
                    this.input.addEventListener('focus', (event) => {
                        this.eventHandlers.onFocus(event);
                    });
                }

                if (this.eventHandlers.onBlur) {
                    this.input.addEventListener('blur', (event) => {
                        this.eventHandlers.onBlur(event);
                    });
                }
            }

            check() {
                this.input.checked = true;
                this.isChecked = true;
                if (this.eventHandlers.onChange) {
                    const event = new Event('change');
                    this.input.dispatchEvent(event);
                }
            }

            uncheck() {
                this.input.checked = false;
                this.isChecked = false;
                if (this.eventHandlers.onChange) {
                    const event = new Event('change');
                    this.input.dispatchEvent(event);
                }
            }

            toggle() {
                this.input.checked = !this.input.checked;
                this.isChecked = this.input.checked;
                if (this.eventHandlers.onChange) {
                    const event = new Event('change');
                    this.input.dispatchEvent(event);
                }
            }

            setText(text) {
                this.textSpan.textContent = text;
            }

            getText() {
                return this.textSpan.textContent;
            }

            getChecked() {
                return this.isChecked;
            }

            enable() {
                this.input.disabled = false;
            }

            disable() {
                this.input.disabled = true;
            }

            destroy() {
                if (this.container && this.container.parentNode) {
                    this.container.parentNode.removeChild(this.container);
                }
            }
        }

/* checbox */


/* radio */

        class GioRadio {
            constructor(parentHtml, id, group, text, isChecked = false, associatedEvents = {}) {
                this.parentHtml = parentHtml;
                this.id = id;
                this.group = group;
                this.text = text;
                this.isChecked = isChecked;
                this.associatedEvents = associatedEvents;

                this.element = null;
                this.radioInput = null;
                this.textElement = null;

                this.createRadio();
                this.addEvents();
            }

            createRadio() {
                const label = document.createElement('label');
                label.className = 'gio-radio-label';

                const input = document.createElement('input');
                input.type = 'radio';
                input.id = this.id;
                input.name = this.group;
                input.value = this.id;
                if (this.isChecked) {
                    input.checked = true;
                }

                const textParagraph = document.createElement('p');
                textParagraph.className = 'gio-radio-text';
                textParagraph.textContent = this.text;

                label.appendChild(input);
                label.appendChild(textParagraph);

                this.parentHtml.appendChild(label);

                this.element = label;
                this.radioInput = input;
                this.textElement = textParagraph;
            }

            addEvents() {
                if (this.radioInput) {
                    for (const eventType in this.associatedEvents) {
                        if (Object.hasOwnProperty.call(this.associatedEvents, eventType)) {
                            this.radioInput.addEventListener(eventType, this.associatedEvents[eventType]);
                        }
                    }
                }
            }

            isChecked() {
                return this.radioInput ? this.radioInput.checked : false;
            }

            setChecked(value) {
                if (this.radioInput) {
                    this.radioInput.checked = value;
                }
            }

            setText(newText) {
                if (this.textElement) {
                    this.textElement.textContent = newText;
                }
            }

            getRadioElement() {
                return this.radioInput;
            }

            getLabelElement() {
                return this.element;
            }
        }
/* radio */

/* tablagio */


    class GioTable {
  constructor(containerId, options = {}) {
    this.container = (typeof containerId == "string") ? document.getElementById(containerId) : containerId;
    this.datos = options.data || [
      { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', edad: 28, departamento: 'Desarrollo', salario: 65000 },
      { id: 2, nombre: 'María García', email: 'maria@email.com', edad: 34, departamento: 'Marketing', salario: 58000 },
      { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', edad: 29, departamento: 'Desarrollo', salario: 72000 },
      { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', edad: 31, departamento: 'Recursos Humanos', salario: 55000 },
      { id: 5, nombre: 'Pedro Rodríguez', email: 'pedro@email.com', edad: 26, departamento: 'Ventas', salario: 48000 },
      { id: 6, nombre: 'Laura Fernández', email: 'laura@email.com', edad: 33, departamento: 'Marketing', salario: 62000 },
      { id: 7, nombre: 'Diego Morales', email: 'diego@email.com', edad: 27, departamento: 'Desarrollo', salario: 68000 },
      { id: 8, nombre: 'Sofia Ruiz', email: 'sofia@email.com', edad: 30, departamento: 'Diseño', salario: 54000 },
      { id: 9, nombre: 'Miguel Torres', email: 'miguel@email.com', edad: 35, departamento: 'Gerencia', salario: 85000 },
      { id: 10, nombre: 'Carmen Jiménez', email: 'carmen@email.com', edad: 28, departamento: 'Contabilidad', salario: 52000 }
    ];
    
    this.searchTerm = '';
    this.filteredData = [];
    this.currentPage = 1;
    this.rowsPerPage = 10;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.showModal = false;
    this.editingItem = null;
    this.formData = {};
    this.availableColumns = [];
    this.visibleColumns = [];
    
    this.init();
  }

  init() {
    this.initializeColumns();
    this.filterData();
    this.render();
    this.bindEvents();
  }

  initializeColumns() {
    if (this.datos.length > 0) {
      this.availableColumns = Object.keys(this.datos[0]).filter(key => key !== 'id');
      this.visibleColumns = [...this.availableColumns];
    }
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredData.slice(start, end);
  }

  normalizeString(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  filterData() {
    if (!this.searchTerm) {
      this.filteredData = [...this.datos];
    } else {
      const normalizedTerm = this.normalizeString(this.searchTerm);
      this.filteredData = this.datos.filter(item => {
        return Object.values(item).some(value => 
          this.normalizeString(value).includes(normalizedTerm)
        );
      });
    }
    this.currentPage = 1;
    this.applySorting();
  }

  sortBy(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  applySorting() {
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];
        
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        if (aVal < bVal) comparison = -1;
        
        return this.sortDirection === 'desc' ? -comparison : comparison;
      });
    }
  }

  getSortClass(column) {
    const classes = ['giotable-th-sortable'];
    if (this.sortColumn === column) {
      classes.push(this.sortDirection === 'asc' ? 'giotable-th-sort-asc' : 'giotable-th-sort-desc');
    }
    return classes.join(' ');
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.renderTable();
      this.renderPagination();
    }
  }

  openModal(item) {
    this.editingItem = item;
    if (item) {
      this.formData = { ...item };
    } else {
      this.formData = {};
      this.availableColumns.forEach(col => {
        this.formData[col] = '';
      });
    }
    this.showModal = true;
    this.renderModal();
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
    this.formData = {};
    this.renderModal();
  }

  saveItem() {
    if (this.editingItem) {
      const index = this.datos.findIndex(item => item.id === this.editingItem.id);
      if (index !== -1) {
        this.datos.splice(index, 1, { ...this.formData, id: this.editingItem.id });
      }
    } else {
      const newId = Math.max(...this.datos.map(item => item.id || 0)) + 1;
      this.datos.push({ ...this.formData, id: newId });
    }
    this.filterData();
    this.renderTable();
    this.renderPagination();
    this.closeModal();
  }

  confirmDelete(item) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      const index = this.datos.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.datos.splice(index, 1);
        this.filterData();
        this.renderTable();
        this.renderPagination();
      }
    }
  }

  showTooltip(event, content) {
    const tooltip = this.container.querySelector('.giotable-tooltip');
    tooltip.textContent = content;
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      tooltip.style.left = '50%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
      tooltip.style.position = 'fixed';
      tooltip.style.zIndex = '2000';
      tooltip.style.maxWidth = '80vw';
      tooltip.style.whiteSpace = 'normal';
      tooltip.style.wordBreak = 'break-word';
    } else {
      tooltip.style.left = event.pageX + 10 + 'px';
      tooltip.style.top = event.pageY - 10 + 'px';
      tooltip.style.transform = 'none';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '1000';
      tooltip.style.maxWidth = '300px';
      tooltip.style.whiteSpace = 'nowrap';
      tooltip.style.wordBreak = 'normal';
    }
    
    tooltip.classList.add('giotable-tooltip-show');
    
    if (isMobile) {
      setTimeout(() => {
        this.hideTooltip();
      }, 3000);
    }
  }

  hideTooltip() {
    const tooltip = this.container.querySelector('.giotable-tooltip');
    tooltip.classList.remove('giotable-tooltip-show');
  }

  handleCellInteraction(event, content) {
    this.showTooltip(event, content);
  }

  formatColumnName(column) {
    return column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1');
  }

  async loadLibrary(url, globalVar) {
    return new Promise((resolve, reject) => {
      if (window[globalVar]) {
        resolve(window[globalVar]);
        return;
      }
      
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        if (window[globalVar]) {
          resolve(window[globalVar]);
        } else {
          reject(new Error(`No se pudo cargar ${globalVar}`));
        }
      };
      script.onerror = () => reject(new Error(`Error cargando ${url}`));
      document.head.appendChild(script);
    });
  }

  async exportToPDF() {
    try {
      if (typeof window.jspdf === 'undefined') {
        await this.loadLibrary('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf');
      }
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('Reporte de Datos - GioTable', 20, 20);
      
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleString()}`, 20, 30);
      
      let yPosition = 45;
      const headers = this.visibleColumns.map(col => this.formatColumnName(col));
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      headers.forEach((header, index) => {
        doc.text(header, 20 + (index * 35), yPosition);
      });
      
      doc.line(20, yPosition + 2, 20 + (headers.length * 35), yPosition + 2);
      
      yPosition += 10;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      for (const item of this.filteredData) {
        this.visibleColumns.forEach((col, index) => {
          const text = String(item[col] || '');
          const displayText = text.length > 20 ? text.substring(0, 17) + '...' : text;
          doc.text(displayText, 20 + (index * 35), yPosition);
        });
        
        yPosition += 8;
        
        if (yPosition > 275) {
          doc.addPage();
          yPosition = 20;
        }
      }
      
      doc.setFontSize(8);
      doc.text(`Total de registros: ${this.filteredData.length}`, 20, yPosition + 10);
      
      doc.save(`giotable-datos-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('No se pudo generar el PDF. Se descargará como archivo de texto.');
      await this.exportToText();
    }
  }

  async exportToExcel() {
    try {
      if (typeof XLSX === 'undefined') {
        await this.loadLibrary('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'XLSX');
      }
      
      const excelData = this.filteredData.map(item => {
        const row = {};
        this.visibleColumns.forEach(col => {
          row[this.formatColumnName(col)] = item[col];
        });
        return row;
      });
      
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      
      const colWidths = this.visibleColumns.map(() => ({ width: 20 }));
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, "Datos-GioTable");
      
      const fileName = `giotable-datos-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Error al generar Excel:', error);
      alert('No se pudo generar Excel. Se descargará como CSV.');
      await this.exportToCSV();
    }
  }

  async exportToCSV() {
    try {
      const headers = this.visibleColumns.map(col => this.formatColumnName(col)).join(',');
      
      const rows = this.filteredData.map(item => 
        this.visibleColumns.map(col => {
          const value = String(item[col] || '');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ).join('\n');
      
      const csvContent = '\uFEFF' + headers + '\n' + rows;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `giotable-datos-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error al generar CSV:', error);
      alert('Error al generar CSV.');
    }
  }

  async exportToText() {
    try {
      const content = this.generateTextReport();
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `giotable-reporte-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar archivo de texto:', error);
      alert('Error al generar archivo de texto.');
    }
  }

  generateTextReport() {
    const separator = '='.repeat(80);
    const lineSeparator = '-'.repeat(80);
    
    let report = `REPORTE GIOTABLE\n${separator}\n`;
    report += `Generado: ${new Date().toLocaleString()}\n`;
    report += `Total de registros: ${this.filteredData.length}\n\n`;
    
    const headers = this.visibleColumns.map(col => this.formatColumnName(col));
    report += headers.join('\t\t') + '\n';
    report += lineSeparator + '\n';
    
    this.filteredData.forEach(item => {
      const row = this.visibleColumns.map(col => String(item[col] || '')).join('\t\t');
      report += row + '\n';
    });
    
    report += `\n${separator}\n`;
    report += `Fin del reporte - ${this.filteredData.length} registros procesados`;
    
    return report;
  }

  printTable() {
    window.print();
  }

  startVideoCall(item) {
    alert(`Iniciando video llamada con ${item.nombre}...`);
  }

  render() {
    this.container.innerHTML = `
      <div class="giotable-container">
        <div class="giotable-header">
          <h1 class="giotable-title">Gestión de Datos</h1>
          <div class="giotable-controls">
            <div class="giotable-search-box">
              <input type="text" 
                     class="giotable-search-input" 
                     placeholder="Buscar..." 
                     value="${this.searchTerm}">
            </div>
            <button class="giotable-btn giotable-btn-primary" id="add-btn">
              Agregar
            </button>
          </div>
        </div>

        <div class="giotable-column-toggle">
          <span class="giotable-column-toggle-span" style="font-weight: 600; margin-right: 12px;">Columnas visibles:</span>
          ${this.availableColumns.map(column => `
            <label class="giotable-column-toggle-label">
              <input type="checkbox" class="column-checkbox" value="${column}" ${this.visibleColumns.includes(column) ? 'checked' : ''}>
              ${this.formatColumnName(column)}
            </label>
          `).join('')}
        </div>

        <div class="giotable-pagination-controls">
          <div class="giotable-rows-per-page">
            <span class="giotable-column-toggle-span">Mostrar:</span>
            <select class="giotable-rows-select" id="rows-per-page">
              <option value="5" ${this.rowsPerPage === 5 ? 'selected' : ''}>5</option>
              <option value="10" ${this.rowsPerPage === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${this.rowsPerPage === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${this.rowsPerPage === 50 ? 'selected' : ''}>50</option>
              <option value="100" ${this.rowsPerPage === 100 ? 'selected' : ''}>100</option>
            </select>
            <span class="giotable-column-toggle-span">filas</span>
          </div>
          
          <div class="giotable-export-buttons">
            <button class="giotable-btn giotable-btn-secondary giotable-btn-small" id="export-pdf">PDF</button>
            <button class="giotable-btn giotable-btn-secondary giotable-btn-small" id="export-excel">Excel</button>
            <button class="giotable-btn giotable-btn-secondary giotable-btn-small" id="export-csv">CSV</button>
            <button class="giotable-btn giotable-btn-secondary giotable-btn-small" id="print-table">Imprimir</button>
          </div>
        </div>

        <div class="giotable-wrapper">
          <table class="giotable-table" id="data-table">
          </table>
        </div>

        <div class="giotable-pagination" id="pagination">
        </div>
      </div>

      <div class="giotable-modal ${this.showModal ? 'giotable-modal-show' : ''}" id="modal">
        <div class="giotable-modal-content">
          <div class="giotable-modal-header">
            <h2 class="giotable-modal-title">${this.editingItem ? 'Editar Registro' : 'Nuevo Registro'}</h2>
            <button class="giotable-close-btn" id="close-modal">&times;</button>
          </div>
          
          <div id="form-fields">
            ${this.availableColumns.map(column => `
              <div class="giotable-form-group">
                <label class="giotable-form-label">${this.formatColumnName(column)}:</label>
                <input type="text" 
                       class="giotable-form-input form-field" 
                       data-column="${column}"
                       value="${this.formData[column] || ''}"
                       placeholder="Ingrese ${this.formatColumnName(column)}">
              </div>
            `).join('')}
          </div>

          <div class="giotable-modal-actions">
            <button class="giotable-btn giotable-btn-secondary" id="cancel-btn">Cancelar</button>
            <button class="giotable-btn giotable-btn-primary" id="save-btn">
              ${this.editingItem ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>

      <div class="giotable-tooltip"></div>
    `;

    this.renderTable();
    this.renderPagination();
  }

  renderTable() {
    const table = this.container.querySelector('#data-table');
    table.innerHTML = `
      <thead>
        <tr class="giotable-tr">
          ${this.visibleColumns.map(column => `
            <th class="giotable-th ${this.getSortClass(column)}" data-column="${column}">
              ${this.formatColumnName(column)}
            </th>
          `).join('')}
          <th class="giotable-th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${this.paginatedData.map(item => `
          <tr class="giotable-tr">
            ${this.visibleColumns.map(column => `
              <td class="giotable-td cell-content" data-content="${item[column]}">
                ${item[column]}
              </td>
            `).join('')}
            <td class="giotable-td">
              <div class="giotable-action-buttons">
                <button class="giotable-btn giotable-btn-success giotable-btn-small edit-btn" data-id="${item.id}">
                  Editar
                </button>
                <button class="giotable-btn giotable-btn-danger giotable-btn-small delete-btn" data-id="${item.id}">
                  Eliminar
                </button>
                <button class="giotable-btn giotable-btn-video giotable-btn-small video-btn" data-id="${item.id}">
                  Video Llamada
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  renderPagination() {
    const pagination = this.container.querySelector('#pagination');
    pagination.innerHTML = `
      <button class="giotable-btn giotable-btn-secondary" id="first-page" ${this.currentPage === 1 ? 'disabled' : ''}>
        Primera
      </button>
      <button class="giotable-btn giotable-btn-secondary" id="prev-page" ${this.currentPage === 1 ? 'disabled' : ''}>
        Anterior
      </button>
      <span class="giotable-pagination-info">
        Página ${this.currentPage} de ${this.totalPages} (${this.filteredData.length} registros)
      </span>
      <button class="giotable-btn giotable-btn-secondary" id="next-page" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
        Siguiente
      </button>
      <button class="giotable-btn giotable-btn-secondary" id="last-page" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
        Última
      </button>
    `;
  }

  renderModal() {
    const modal = this.container.querySelector('#modal');
    modal.className = `giotable-modal ${this.showModal ? 'giotable-modal-show' : ''}`;
    
    const title = modal.querySelector('.giotable-modal-title');
    title.textContent = this.editingItem ? 'Editar Registro' : 'Nuevo Registro';
    
    const formFields = modal.querySelector('#form-fields');
    formFields.innerHTML = this.availableColumns.map(column => `
      <div class="giotable-form-group">
        <label class="giotable-form-label">${this.formatColumnName(column)}:</label>
        <input type="text" 
               class="giotable-form-input form-field" 
               data-column="${column}"
               value="${this.formData[column] || ''}"
               placeholder="Ingrese ${this.formatColumnName(column)}">
      </div>
    `).join('');
    
    const saveBtn = modal.querySelector('#save-btn');
    saveBtn.textContent = this.editingItem ? 'Actualizar' : 'Crear';
  }

  bindEvents() {
    const searchInput = this.container.querySelector('.giotable-search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.filterData();
      this.renderTable();
      this.renderPagination();
    });

    this.container.addEventListener('click', async (e) => {
      if (e.target.id === 'add-btn') {
        this.openModal(null);
      } else if (e.target.id === 'close-modal' || e.target.id === 'cancel-btn') {
        this.closeModal();
      } else if (e.target.id === 'save-btn') {
        const formFields = this.container.querySelectorAll('.form-field');
        formFields.forEach(field => {
          this.formData[field.dataset.column] = field.value;
        });
        this.saveItem();
      } else if (e.target.classList.contains('edit-btn')) {
        const id = parseInt(e.target.dataset.id);
        const item = this.datos.find(d => d.id === id);
        this.openModal(item);
      } else if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id);
        const item = this.datos.find(d => d.id === id);
        this.confirmDelete(item);
      } else if (e.target.classList.contains('video-btn')) {
        const id = parseInt(e.target.dataset.id);
        const item = this.datos.find(d => d.id === id);
        this.startVideoCall(item);
      } else if (e.target.classList.contains('giotable-th-sortable') || e.target.dataset.column) {
        const column = e.target.dataset.column;
        if (column) {
          this.sortBy(column);
          this.renderTable();
        }
      } else if (e.target.id === 'first-page') {
        this.goToPage(1);
      } else if (e.target.id === 'prev-page') {
        this.goToPage(this.currentPage - 1);
      } else if (e.target.id === 'next-page') {
        this.goToPage(this.currentPage + 1);
      } else if (e.target.id === 'last-page') {
        this.goToPage(this.totalPages);
      } else if (e.target.id === 'export-pdf') {
        e.target.textContent = 'Generando...';
        e.target.disabled = true;
        await this.exportToPDF();
        e.target.textContent = 'PDF';
        e.target.disabled = false;
      } else if (e.target.id === 'export-excel') {
        e.target.textContent = 'Generando...';
        e.target.disabled = true;
        await this.exportToExcel();
        e.target.textContent = 'Excel';
        e.target.disabled = false;
      } else if (e.target.id === 'export-csv') {
        e.target.textContent = 'Generando...';
        e.target.disabled = true;
        await this.exportToCSV();
        e.target.textContent = 'CSV';
        e.target.disabled = false;
      } else if (e.target.id === 'print-table') {
        this.printTable();
      } else if (e.target.classList.contains('giotable-modal') && e.target.id === 'modal') {
        this.closeModal();
      }
    });

    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('column-checkbox')) {
        const column = e.target.value;
        if (e.target.checked) {
          this.visibleColumns.push(column);
        } else {
          this.visibleColumns = this.visibleColumns.filter(col => col !== column);
        }
        this.renderTable();
      } else if (e.target.id === 'rows-per-page') {
        this.rowsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
      }
    });

    this.container.addEventListener('mouseenter', (e) => {
      if (e.target.classList.contains('cell-content')) {
        this.handleCellInteraction(e, e.target.dataset.content);
      }
    }, true);

    this.container.addEventListener('mouseleave', (e) => {
      if (e.target.classList.contains('cell-content')) {
        this.hideTooltip();
      }
    }, true);

    this.container.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('cell-content')) {
        this.handleCellInteraction(e, e.target.dataset.content);
      }
    });
  }
}

/* tabla gio */

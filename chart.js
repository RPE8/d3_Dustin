class Chart {
    constructor(sFirstChartId, sSecondChartId) {
        const oMargin = this.oMargin = {
            top: 20,
            right: 10,
            left: 60,
            bottom: 40
        }

        const oFirstChartWrapper = this.oFirstChartWrapper = d3.select(`#${sFirstChartId}Wrapper`);
        const oSecondChartWrapper = this.oSecondChartWrapper = d3.select(`#${sSecondChartId}Wrapper`);

        const oCalculatedSizeFirst = this.oCalculatedSizeFirst =  Chart.getElementSizeWoBoxSizing(oFirstChartWrapper.node());
        const oFirstChartSvg = this.oFirstChartSvg = oFirstChartWrapper.append("svg")
            .attr("id", sFirstChartId)
            .attr("width", oCalculatedSizeFirst.width)
            .attr("height", oCalculatedSizeFirst.height - 5);

        // Calculates size for second chart after the first one, because adding of first svg makes and impact on
        //    available size for second one. 
        const oCalculatedSizeSecond = this.oCalculatedSizeSecond = Chart.getElementSizeWoBoxSizing(oSecondChartWrapper.node());
        const oSecondChartSvg = this.oSecondChartSvg = oSecondChartWrapper.append("svg")
            .attr("id", sSecondChartId)
            .attr("width", oCalculatedSizeSecond.width)
            .attr("height", oCalculatedSizeSecond.height - 5);
    }

    drawFirstChart() {
        let aColumnsData = this.columnsData;
        const $Svg = this.oFirstChartSvg;
        const oMargin = this.oMargin;

        if (!aColumnsData || !$Svg) {
            console.log("drawFirstChart no data");
            return false;
        }

        const oYScale = this.oYScale = d3.scaleLinear()
            .range([this.oCalculatedSizeFirst.height - oMargin.bottom, oMargin.top + oMargin.bottom])
            .domain([0, 100]);

        const oXScale = this.oXScale = d3.scaleBand()
            .range([this.oCalculatedSizeFirst.width - oMargin.right, oMargin.left + oMargin.right])
            .domain(aColumnsData.map((oData) => {
                return `${oData.sYear}/${oData.sMonth}`;
            }));

        const oYAxis = this.oYAxis = d3.axisLeft(oYScale);
        const oXAxis = this.oXAxis = d3.axisBottom(oXScale);

        $Svg.append("g")
            .attr("transform", `translate(${oMargin.left},${-oMargin.bottom})`)
            .call(oYAxis);
        
        $Svg.append("g")
            .attr("transform", `translate(${-oMargin.right},${this.oCalculatedSizeFirst.height - oMargin.bottom - oMargin.top})`)
            .call(oXAxis);
        
    }

    drawSecondChart() {

    }
    
    set columnsData(aData) {
        this.columnsDataValue = aData;
    }

    get columnsData() {
        return this.columnsDataValue;
    }

    set firstLineData(aData) {
        this.firstLineDataValue = aData;
    }

    get firstLineData() {
        return this.firstLineDataValue;
    }

    set secondLineData(aData) {
        this.secondLineDataValue = aData;
    }

    get secondLineData() {
        return this.secondLineDataValue;
    }

    generateDataForChart() {
        this.generateAndSetColumnsData();
        this.generateAndSetFirstLineData();
        this.generateAndSetSecondLineData();
    }

    generateAndSetColumnsData() {
        this.columnsData = this.generateRandomData();
    }

    generateAndSetFirstLineData() {
        this.firstLineData = this.generateRandomData();
    }

    generateAndSetSecondLineData() {
        this.secondLineData = this.generateRandomData();
    }

    generateRandomData(iMonths = 12, iMaxValue = 100) {
        let aGeneratedData = [];

        for (let i = 0; i < iMonths; i++) {
            let dDate = new Date(2022, i, 1, 0, 0, 0, 0);
            aGeneratedData.push({
                sYear: dDate.getFullYear(),
                sMonth: +dDate.getMonth() + 1,
                dDate: dDate,
                iValue: Chart.generateRandomInteger(iMaxValue)
            });
        }

        return aGeneratedData;
    }
    
    static generateRandomInteger(iMax) {
        return Math.floor(Math.random() * iMax);
    }

    static getElementSizeWoBoxSizing(element) {
        const oStyle = window.getComputedStyle(element);
        const fPaddingX = parseFloat(oStyle.paddingLeft) + parseFloat(oStyle.paddingRight);
        const fPaddingY = parseFloat(oStyle.paddingTop) + parseFloat(oStyle.paddingBottom);

        const fBorderX = parseFloat(oStyle.borderLeftWidth) + parseFloat(oStyle.borderRightWidth);
        const fBorderY = parseFloat(oStyle.borderTopWidth) + parseFloat(oStyle.borderBottomWidth);
        return {
            height: element.offsetHeight - fPaddingY - fBorderY,
            width: element.offsetWidth - fPaddingX - fBorderX
        }
    }

    static getElementSizeWiBoxSizing(element) {
        return {
            height: element.getBoundingClientRect().height,
            width: element.getBoundingClientRect().width
        }
    }
}


const chart = new Chart("firstChart", "secondChart");
chart.generateDataForChart();
console.log('Columns:');
console.log(chart.columnsData);
console.log('First Line:');
console.log(chart.firstLineData);
console.log('SecondLine:');
console.log(chart.secondLineData);
chart.drawFirstChart();

// window.addEventListener("resize", chart.redraw);
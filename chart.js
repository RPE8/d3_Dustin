// TODO: draw content based on postion of container;

class Chart {
    constructor(sFirstChartId, sSecondChartId) {
        const oChartContentMargin = this.oChartContentMargin = {
            top: 20,
            right: 20,
            left: 50,
            bottom: 60
        }

        const oChartMargin = this.oChartMargin = {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        };

        const oFirstChartWrapper = this.oFirstChartWrapper = d3.select(`#${sFirstChartId}Wrapper`);
        const oSecondChartWrapper = this.oSecondChartWrapper = d3.select(`#${sSecondChartId}Wrapper`);

        const oCalculatedSizeFirst = this.oCalculatedSizeFirst =  Chart.getElementSizeWoBoxSizing(oFirstChartWrapper.node());
        this.oCalculatedSizeFirst.height -= this._additionalHeight;
        const oFirstChartSvg = this.oFirstChartSvg = oFirstChartWrapper.append("svg")
            .attr("id", sFirstChartId)
            .attr("width", oCalculatedSizeFirst.width)
            .attr("height", oCalculatedSizeFirst.height);

        const oFirstChartContent = this.oFirstChartContent = oFirstChartSvg.append("g")
            .attr("id", `${sFirstChartId}-content`)
            .attr("min-width", oCalculatedSizeFirst.width)
            .attr("min-height", oCalculatedSizeFirst.height);


        oFirstChartContent.attr("transform", `translate(${oChartMargin.left - oChartMargin.right},${oChartMargin.top - oChartMargin.bottom})`)
        // Calculates size for second chart after the first one, because adding of first svg makes and impact on
        //    available size for second one. 
        const oCalculatedSizeSecond = this.oCalculatedSizeSecond = Chart.getElementSizeWoBoxSizing(oSecondChartWrapper.node());
        this.oCalculatedSizeSecond.height -= this._additionalHeight;
        const oSecondChartSvg = this.oSecondChartSvg = oSecondChartWrapper.append("svg")
            .attr("id", sSecondChartId)
            .attr("width", oCalculatedSizeSecond.width)
            .attr("height", oCalculatedSizeSecond.height);

        const oSecondChartContent = this.oSecondChartContent = oSecondChartSvg.append("g");
    }

    drawFirstChart() {
        let aColumnsData = this.columnsData;
        let aLineData = this.firstLineData;
        const $ChartContainer = this.oFirstChartContent;
        const oContentMargin = this.oChartContentMargin;
        const oContainerMargin = this.oChartMargin;

        if (!aColumnsData || !$ChartContainer) {
            console.log("drawFirstChart no data");
            return false;
        }

        const oYScale = this.oYScale = d3.scaleLinear()
            .range([this.oCalculatedSizeFirst.height - oContentMargin.bottom, oContentMargin.top])
            .domain([0, 100]);

        const oXScale = this.oXScale = d3.scaleBand()
            .range([oContentMargin.left, this.oCalculatedSizeFirst.width - oContentMargin.right])
            .domain(aColumnsData.map((oData) => oData.sLabel));

        const oYAxis = this.oYAxis = d3.axisLeft(oYScale);
        const oXAxis = this.oXAxis = d3.axisBottom(oXScale);

        const lineGenerator = d3.line()
            .x((d) => oXScale(d.sLabel))
            .y((d) => oYScale(d.iValue))
            .curve(d3.curveBasis);

        

        $ChartContainer.append("g")
            .attr("transform", `translate(${oContentMargin.left},${0})`)
            .call(oYAxis);
        
        $ChartContainer.append("g")
            .attr("transform", `translate(${0},${this.oCalculatedSizeFirst.height - oContentMargin.bottom})`)
            .call(oXAxis);

        const $Bars = this.$Bars = $ChartContainer.append("g")
            // .attr("transform", `translate(${(oContainerMargin.left - oContainerMargin.right) + oContentMargin.left},${(oContainerMargin.top - oContainerMargin.bottom) + oContentMargin.top})`)         
            .selectAll("rect")
            .data(aColumnsData)
            .join("rect")
                .attr("x", (d, i) => oXScale(d.sLabel))
                .attr("y", (d, i) => oYScale(d.iValue))
                .attr("height", (d, i) => oYScale(0) - oYScale(d.iValue))
                .attr("width", oXScale.bandwidth());


        const line = $ChartContainer.append("path")
            .attr("d", lineGenerator(aLineData))
            .attr("fill", "none")
            .attr("stroke", "Red")
            .attr("stroke-width", 2);
        // const $Line = this.$Line = $ChartContainer.append("path")
        //     .attr('class', "line-1")


    }

    get _additionalHeight() {
        return 5;
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
            aGeneratedData[i].sLabel = `${aGeneratedData[i].sYear}/${aGeneratedData[i].sMonth}`
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
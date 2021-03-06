// TODO: draw content based on postion of container;

class Chart {
    constructor(sFirstChartId, sSecondChartId) {
        const oChartContentMargin = this.oChartContentMargin = {
            top: 20,
            right: 20,
            left: 20,
            bottom: 50
        }

        const oChartContainerMargin = this.oChartContainerMargin = {
            top: 10,
            right: 10,
            left: 10,
            bottom: 10
        };

        const oChartMargin = this.oFirstChartMargin = {
            top: 10,
            right: 10,
            left: 30,
            bottom: 10
        };
        

        const fnYAccessor = this.fnYAccessor = (d) => d.iValue;
        const fnXAccessor = this.fnXAccessor = (d) => d.sLabel;


        const $FirstChartWrapper = this.$FirstChartWrapper = d3.select(`#${sFirstChartId}-wrapper`);
        const $SecondChartWrapper = this.$SecondChartWrapper = d3.select(`#${sSecondChartId}-wrapper`);

        this.sFirstChartId = sFirstChartId;

        

        this.generateDataForChart();
        // this.drawFirstChart();

        const oObserver = this.oObserver = new ResizeObserver(aEntries => {
            this.recalculateSizeVariables();
            console.log("resize");
            this.drawFirstChart();
        });
        
        oObserver.observe(document.getElementById("chart"));

        // $FirstChartContent.attr("transform", `translate(${oChartContainerMargin.left - oChartContainerMargin.right},${oChartContainerMargin.top - oChartContainerMargin.bottom})`)
        // Calculates size for second chart after the first one, because adding of first svg makes and impact on
        //    available size for second one. 
        // const oCalculatedSizeSecond = this.oCalculatedSizeSecond = Chart.getElementSizeWoBoxSizing($SecondChartWrapper.node());
        // this.oCalculatedSizeSecond.height -= this._additionalHeight;

        // const $SecondChartSvg = this.$SecondChartSvg = $SecondChartWrapper.append("svg"10
        //     .attr("id", sSecondChartId)
        //     .attr("width", oCalculatedSizeSecond.width)oChartContentMargin.left
        //     .attr("height", oCalculatedSizeSecond.height);

        // const $SecondChartContent = this.$SecondChartContent = $Second))
                // .attr("y", (d, i) => oYScale(d.iVaChartSvg.append("g")
        //     .attr("id", `${sSecondChartId}-content`)
        //     .attr("min-width", oCalculatedSizeSecond.width)
        //     .attr("min-height", oCalculatedSizeSecond.height);
    }

    recalculateSizeVariables() {
        const $FirstChartWrapper = this.$FirstChartWrapper;
        const oChartContainerMargin = this.oChartContainerMargin;
        const oChartContentMargin = this.oChartContentMargin;
        const oSize = Chart.getElementSizeWoBoxSizing($FirstChartWrapper.node());
        oSize.height -= this._additionalHeight;
        let oCalculatedSizeFirst = this.oCalculatedSizeFirst = {
            original: oSize,
            container: {
                height: oSize.height - (oChartContainerMargin.top + oChartContainerMargin.bottom),
                width: oSize.width - (oChartContainerMargin.left + oChartContainerMargin.right)
            }
        };

        oCalculatedSizeFirst.content = {
            height: oCalculatedSizeFirst.container.height - (oChartContentMargin.top + oChartContentMargin.bottom),
            width: oCalculatedSizeFirst.container.width - (oChartContentMargin.left + oChartContentMargin.right)
        }
    }

    drawFirstChart() {
        let aColumnsData = this.columnsData;
        let aLineData = this.firstLineData;  

        const oChartMargin = this.oFirstChartMargin;

        let oCalculatedSizeFirst = this.oCalculatedSizeFirst;
        oCalculatedSizeFirst.chart = {
            height: oCalculatedSizeFirst.content.height - (oChartMargin.top + oChartMargin.bottom),
            width: oCalculatedSizeFirst.content.width - (oChartMargin.left + oChartMargin.right)
        }

        const oChartContainerMargin = this.oChartContainerMargin;
        const oChartContentMargin = this.oChartContentMargin;

        if (this.$FirstChartContainer) {
            this.$FirstChartContainer.remove();
        }

        const $FirstChartContainer = this.$FirstChartContainer = this.$FirstChartWrapper.append("svg")
            .attr("id", `${this.sFirstChartId}-container`)
            .style("margin", `${oChartContainerMargin.top} ${oChartContainerMargin.right} ${oChartContainerMargin.bottom} ${oChartContainerMargin.left}`)
            .attr("width", oCalculatedSizeFirst.container.width)
            .attr("height", oCalculatedSizeFirst.container.height);

        const $FirstChartContent = this.$FirstChartContent = $FirstChartContainer.append("svg")
            .attr("id", `${this.sFirstChartId}-content`)
            .attr("width", oCalculatedSizeFirst.content.width)
            .attr("height", oCalculatedSizeFirst.content.height)
            .attr("x", oChartContentMargin.left)
            .attr("y", oChartContentMargin.top)

        const $ChartContent = this.$FirstChartContent;

        if (!aColumnsData || !$ChartContent) {
            console.log("drawFirstChart no data");
            return false;
        }

        const oYScale = this.oYScale = d3.scaleLinear()
            .range([oCalculatedSizeFirst.chart.height, oChartMargin.top])
            // 110 is for additional space for labels of bars, that will have 100 value.
            .domain([0, 110]);

        const oXScale = this.oXScale = d3.scaleBand()
            .range([oChartMargin.left, oCalculatedSizeFirst.chart.width])
            .domain(aColumnsData.map(this.fnXAccessor))
            .paddingOuter(0.5)
            .paddingInner(0.5)

        const oYAxis = this.oYAxis = d3.axisLeft(oYScale);
        const oXAxis = this.oXAxis = d3.axisBottom(oXScale);

        const fnXScaleAccessor = this.fnXScaleAccessor = (d) => oXScale(this.fnXAccessor(d));
        const fnYScaleAccessor = this.fnYScaleAccessor = (d) => oYScale(this.fnYAccessor(d));
        const fnHeightBarAccessor = this.fnHeightBarAccessor = (d) => oYScale(0) - oYScale(this.fnYAccessor(d));

        const lineGenerator = d3.line()
            .x(fnXScaleAccessor)
            .y(fnYScaleAccessor)
            // .curve(d3.curveBasis);

        $ChartContent.append("g")
            .attr("transform", `translate(${oChartMargin.left},${0})`)
            .call(oYAxis);
        
        $ChartContent.append("g")
            .attr("transform", `translate(${0},${oCalculatedSizeFirst.chart.height})`)
            .call(oXAxis);
        
        const $BarsContainer = this.$BarsContainer = $ChartContent.append("g");

        let $Bars = this.$Bars = $BarsContainer.selectAll('.bar')
            .data(aColumnsData)
            .enter()
            .append("g");

        $Bars.append("rect")
            .attr("x", fnXScaleAccessor)
            .attr("y", fnYScaleAccessor)
            .style("padding-top", "10px")
            .attr("height", fnHeightBarAccessor)
            .attr("width", oXScale.bandwidth());
        //         
        //     .selectAll("rect")
        //     .data(aColumnsData)
        //     .enter()
        //     ("rect")
                

        $Bars.append("text")
            .text(this.fnYAccessor)
            .attr("x", (d) => {
                console.log(d);
                return this.fnXScaleAccessor(d) + oXScale.bandwidth(this.fnXScaleAccessor(d))/2;
            })
            .attr("y", (d) => {
                return this.fnYScaleAccessor(d) - 5;
            })
            .attr("width", 20)
            .attr("height", 20)
            .attr("font-size" , "14px")
            .attr("color" , "red")
            .attr("fill" , "red")
            .attr("text-anchor", "middle");
            

        const line = $ChartContent.append("path")
            .attr("d", lineGenerator(aLineData))
            .attr("fill", "none")
            .attr("stroke", "Red")
            .attr("stroke-width", 2);
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


// window.addEventListener("resize", chart.redraw);
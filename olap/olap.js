window.prepareReportData = function(measures,reportData,remain)
{
	var result = {children: {},childCount: 0};
	var data = reportData.d;
	if(data != null)
	{
		for(var name in data)
		{
			var child = (remain <= 1) ? {data: data[name]} :
				window.prepareReportData(measures,data[name],remain - 1);
			result.children[name] = child;
			result.childCount++;
		}
	}
	data = reportData.t;
	if(data != null)
	{
		if(remain > 1)
			result.total = window.prepareReportData(measures,data,remain - 1);
		for(var i = remain - 1;i > 0;i--)
		{
			if(data != null)
				data = data.t;
		}
		result.data = data;
		if(remain <= 1)
			result.total = data == null ? null : {data: data};
	}
	return result;
}
window.withTotalData = function(input,target,callback)
{
	if(target == null || target > 0 && input.total != null)
		window.withTotalData(input.total,target == null ? null : target - 1,callback);
	else
		callback(input.children);
}
window.withLevelData = function(input,target,callback)
{
	if(target == null || target > 0)
	{
		for(var name in input.children)
			window.withLevelData(input.children[name],target == null ? null : target - 1,callback);
	}
	else
		callback(input.children);
}
window.fillLevelNames = function(output,input,target)
{
	window.withLevelData(input,target,function(result)
	{
		for(var name in result)
		{
			if(output.names.indexOf(name) < 0)
			{
				output.indexes[name] = output.names.length;
				output.names.push(name);
			}
		}
	});
}
window.getLevelNames = function(input,target)
{
	var output = {names:[], indexes: {}};
	fillLevelNames(output,input,target);
	return output.names;
}
window.formatDimension = function(dimension,value,format,type)
{
	if(value == null || value == 'null')
		return "";
	if(type == null)
		type = dimension.type;
	if(type == 3)
	{
		if(format == null || format == '')
			format = dimension.format;
		if(format == null || format == '')
			format = "DD/MM/YYYY HH:mm:ss";
		else
			format = format.split("yyyy").join("YYYY").split("dd").join("DD");
		return moment(parseFloat(value) + window.serverTimeZoneDelta).format(format);
	}
	else if(type == 1)
	{
		if(format == null || format == '')
			format = dimension.format;
		if(format == null || format == '')
			format = "#,###";
		return new DecimalFormat(format).format(value);
	}
	else
		return value;
}
window.getMeasureFormatter = function(measure)
{
	if(measure.formatter == null)
	{
		var format = measure.format;
		if(format == null || format == '')
			format = "#,###";
		measure.formatter = new DecimalFormat(format);
	}
	return measure.formatter;
}
window.formatMeasure = function(measure,value)
{
	if(value == null || value == 'null')
		return "";
	if(measure.type == 3)
	{
		var format = measure.format;
		if(format == null || format == '')
			format = measure.format;
		if(format == null || format == '')
			format = "DD/MM/YYYY HH:mm:ss";
		else
			format = format.split("yyyy").join("YYYY").split("dd").join("DD");
		return moment(parseFloat(value) + window.serverTimeZoneDelta).format(format);
	}
	else if(measure.type == 1)
		return getMeasureFormatter(measure).format(value);
	else
		return value;
}
window.recursiveData = function(rollup,input,target,callback,path,includeDataRow,totalFirst)
{
	if(includeDataRow == null)
		includeDataRow = true;
	if(path == null)
		path = [];
	if(callback(input,path) == false)
		return;
	if((target == null || target >= 0))
	{
		var nextTarget = target == null ? null : target - 1;
		if(totalFirst)
		{
			if((input.childCount > 1 || input.showTotal == true ||
			    (!includeDataRow && input.childCount == 1)) && input.total != null)
			{
				path.push("${TR}");
				window.recursiveData(rollup,input.total,
					nextTarget,callback,path,!rollup,totalFirst);
				path.pop();
			}
		}
		if(input.children != null && includeDataRow)
		{
			for(var name in input.children)
			{
				path.push(name);
				window.recursiveData(rollup,input.children[name],
					nextTarget,callback,path,includeDataRow,totalFirst);
				path.pop();
			}
		}
		if(!totalFirst)
		{
			if((input.childCount > 1 || input.showTotal == true ||
			    (!includeDataRow && input.childCount == 1)) && input.total != null)
			{
				path.push("${TR}");
				window.recursiveData(rollup,input.total,
					nextTarget,callback,path,!rollup,totalFirst);
				path.pop();
			}
		}
	}
}
window.fullRecursiveData = function(input,target,callback,path,totalFirst)
{
	if(path == null)
		path = [];
	if(callback(input,path) == false)
		return;
	if((target == null || target >= 0))
	{
		var nextTarget = target == null ? null : target - 1;
		if(totalFirst)
		{
			if(input.total != null)
			{
				path.push("${TR}");
				window.fullRecursiveData(input.total,
					nextTarget,callback,path,totalFirst);
				path.pop();
			}
		}
		if(input.children != null)
		{
			for(var name in input.children)
			{
				path.push(name);
				window.fullRecursiveData(input.children[name],
					nextTarget,callback,path,totalFirst);
				path.pop();
			}
		}
		if(!totalFirst)
		{
			if(input.total != null)
			{
				path.push("${TR}");
				window.fullRecursiveData(input.total,
					nextTarget,callback,path,totalFirst);
				path.pop();
			}
		}
	}
}
window.requireChartLibrary = function(callback) {
  if ($.fn.highcharts == null) {
    $.fn.highcharts = {};
    loadScript('js/chart.js', function() {
      loadScript('js/export.js', function() {
        loadScript('js/offline-export.js', callback);
      });
    });
  } else {
    if (window.Highcharts == null) {
      setTimeout(function() {
        window.requireChartLibrary(callback);
      }, 100);
    } else {
      callback();
    }
  }
};

function loadScript(url, callback) {
  var script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

/* BEGIN PIE CHART RENDER */
window.renderPieChart = function(reportContainer,reportData,reportOptions)
{
	var dimensions = reportData.dimensions;
	var measures = reportData.measures;
	var data = reportData.data;
	var pieSerieIndex = reportOptions.pieSerieIndex;
	if(pieSerieIndex == null || pieSerieIndex < 0 || pieSerieIndex >= dimensions.length)
	{
		pieSerieIndex = dimensions.length - 1;
		reportOptions.pieSerieIndex = pieSerieIndex;
	}
	var measureIndex = reportOptions.measureIndex;
	if(measureIndex == null || measureIndex < 0 || measureIndex >= measures.length)
	{
		measureIndex = 0;
		reportOptions.measureIndex = measureIndex;
	}

	var output = {};
	window.withTotalData(data,pieSerieIndex,function(result)
	{
		for(var name in result)
		{
			if(result[name].data != null)
				output[name] = result[name].data[measureIndex];
		}
	});
	var chartData = [];
	var dimension = dimensions[pieSerieIndex];
	for(var name in output)
		chartData.push({name: window.formatDimension(dimension,name), y: output[name], value: name});

	var chartContainer = $("<div class='chart pieChart'></div>");
	reportContainer.empty();
	reportContainer.append(chartContainer);
	window.requireChartLibrary(function()
	{
		var chartOptions = {
			chart: { type: 'pie' }, title: { text: '' },
			legend: {maxHeight: 80},
			plotOptions: {
				pie: {showInLegend: true},
				series: {
					point: {
						events: {
							click: function () {
								if(!window.drillDown(reportData,reportOptions,pieSerieIndex,this.value,this))
								{
									if(reportData.showDataTableOnly)
										reportData.drill();
								}
							}
						}
					}
				}
			},
			series: [{
				name: measures[measureIndex].caption,
				data: chartData
			}]
		};
		if(reportData.chartOptions != null) $.extend(chartOptions,reportData.chartOptions);
		if(reportData.pieChartOptions != null) $.extend(chartOptions,reportData.pieChartOptions);
		if(reportData.chartScript != null)
			reportData.chartScript(reportData,chartOptions);
		chartContainer.highcharts(chartOptions);
	});

	if((dimensions.length > 1 || measures.length > 1) && !reportData.showDataTableOnly)
	{
		var optionPanel = $("<div class='option_panel'></div>");
		reportContainer.prepend(optionPanel);
		if(dimensions.length > 1)
		{
			var comboBoxData = {};
			for(var i = 0;i < dimensions.length;i++)
				comboBoxData[i] = dimensions[i].caption;
			var comboBox = $(window.buildComboBox(comboBoxData,pieSerieIndex));
			comboBox.change(function()
			{
				reportOptions.pieSerieIndex = parseInt($(this).val());
				window.renderReport(reportContainer,reportData,reportOptions)
			});
			window.addOptionPanelInput(optionPanel,"Dữ liệu",comboBox);
		}
		if(measures.length > 1)
		{
			var comboBoxData = {};
			for(var i = 0;i < measures.length;i++)
			{
				var measure = measures[i];
				comboBoxData[i] = measure.caption;
			}
			var comboBox = $(window.buildComboBox(comboBoxData,measureIndex));
			comboBox.change(function()
			{
				reportOptions.measureIndex = parseInt($(this).val());
				window.renderReport(reportContainer,reportData,reportOptions)
			});
			window.addOptionPanelInput(optionPanel,"Giá trị",comboBox);
		}
	}
}
/* END PIE CHART RENDER */


/* BEGIN XY CHART RENDER */
window.renderXYChart = function(type,reportContainer,reportData,reportOptions)
{
	var dimensions = reportData.dimensions;
	var measures = reportData.measures;
	var data = reportData.data;
	var categoryIndex = reportOptions.categoryIndex;
	if(categoryIndex == null || categoryIndex < 0 || categoryIndex >= dimensions.length)
	{
		categoryIndex = 0;
		reportOptions.categoryIndex = categoryIndex;
	}
	var serieIndex = reportOptions.serieIndex;
	if(serieIndex == null || serieIndex < 0 || serieIndex >= dimensions.length)
	{
		serieIndex = dimensions.length - 1;
		reportOptions.serieIndex = serieIndex;
	}
	var measureIndex = reportOptions.measureIndex;
	if(measureIndex == null || measureIndex < 0 || measureIndex >= measures.length)
	{
		measureIndex = 0;
		reportOptions.measureIndex = measureIndex;
	}

	var categoryDimension = dimensions[categoryIndex];
	var categoryValues = window.getLevelNames(data,categoryIndex);
	var categoryNames = [];
	var categoryIndexes = {};
	for(var i = 0;i < categoryValues.length;i++)
	{
		var categoryValue = categoryValues[i];
		categoryIndexes[categoryValue] = i;
		categoryNames[i] = window.formatDimension(categoryDimension,categoryValue);
	}

	var output = {};
	var minIndex = Math.min(serieIndex,categoryIndex);
	var maxIndex = Math.max(serieIndex,categoryIndex);
	window.withTotalData(data,minIndex,function(result)
	{
		if(serieIndex == categoryIndex)
		{
			for(var grandSubName in result)
			{
				var grandSubData = result[grandSubName];
				if(grandSubData.data == null)
					continue;
				var serieName = measures[measureIndex].caption;
				var serie = output[serieName];
				if(serie == null)
				{
					serie = new Array(categoryNames.length);
					for(var i = 0;i < serie.length;i++)
						serie[i] = null;
					output[serieName] = serie;
				}
				serie[categoryIndexes[grandSubName]] = grandSubData.data[measureIndex];
			}
		}
		else
		{
			for(var subName in result)
			{
				var subData = result[subName];
				window.withTotalData(subData,maxIndex - minIndex - 1,function(result)
				{
					for(var grandSubName in result)
					{
						var grandSubData = result[grandSubName];
						var catName, serieName;
						if(serieIndex > categoryIndex)
						{
							catName = subName;
							serieName = grandSubName;
						}
						else
						{
							serieName = subName;
							catName = grandSubName;
						}
						var serie = output[serieName];
						if(serie == null)
						{
							serie = new Array(categoryNames.length);
							for(var i = 0;i < serie.length;i++)
								serie[i] = null;
							output[serieName] = serie;
						}
						serie[categoryIndexes[catName]] = grandSubData.data[measureIndex];
					}
				});
			}
		}
	});
	var series = [];
	var serieDimension = dimensions[serieIndex];
	for(var serie in output)
	{
		var serieName = serieIndex != categoryIndex ? formatDimension(serieDimension,serie) : serie;
		series.push({name: serieName, value: serie, data: output[serie]});
	}

	var chartContainer = $("<div class='chart " + type + "Chart'></div>");
	reportContainer.empty();
	reportContainer.append(chartContainer);
	window.requireChartLibrary(function()
	{
		var chartOptions = {
			chart: { type: type }, title: { text: '' },
			xAxis: { categories: categoryNames },
			yAxis: { title: { text: measures[measureIndex].caption } },
			plotOptions: {
				column: { stacking: 'normal' },
				bar: { stacking: 'normal' },
				area: { stacking: 'normal' },
				series: {
					point: {
						events: {
							click: function () {
								if(!window.drillDown(reportData,reportOptions,serieIndex,
									serieIndex == categoryIndex ? categoryValues[this.x] : this.series.options.value,this))
								{
									if(reportData.showDataTableOnly)
										reportData.drill();
								}
							}
						}
					}
				}
			},
			series: series
		};

		if(reportData.chartOptions != null) $.extend(chartOptions,reportData.chartOptions);
		if(reportData[type + "ChartOptions"] != null) $.extend(chartOptions,reportData[type + "ChartOptions"]);
		if(reportData.chartScript != null)
			reportData.chartScript(reportData,chartOptions);
		chartContainer.highcharts(chartOptions);
		chartContainer.find('.highcharts-xaxis-labels > text').click(function(event) {
			var v = this.textContent;
			for(var i in categoryNames)
			{
				if(categoryNames[i] == v)
				{
					v = i;
					break;
				}
			}
			if(!window.drillDown(reportData,reportOptions,categoryIndex,categoryValues[v],this))
			{
				if(reportData.showDataTableOnly)
					reportData.drill();
			}
		});
	});
	if((dimensions.length > 1 || measures.length > 1) && !reportData.showDataTableOnly)
	{
		var optionPanel = $("<div class='option_panel'></div>");
		reportContainer.prepend(optionPanel);
		if(dimensions.length > 1)
		{
			var comboBoxData = {};
			for(var i = 0;i < dimensions.length;i++)
				comboBoxData[i] = dimensions[i].caption;
			var comboBox = $(window.buildComboBox(comboBoxData,categoryIndex));
			comboBox.change(function()
			{
				reportOptions.categoryIndex = parseInt($(this).val());
				window.renderReport(reportContainer,reportData,reportOptions)
			});
			window.addOptionPanelInput(optionPanel,"Dữ liệu",comboBox);
			comboBox = $(window.buildComboBox(comboBoxData,serieIndex));
			comboBox.change(function()
			{
				reportOptions.serieIndex = parseInt($(this).val());
				window.renderReport(reportContainer,reportData,reportOptions)
			});
			window.addOptionPanelInput(optionPanel,null,comboBox);
		}
		if(measures.length > 1)
		{
			var comboBoxData = {};
			for(var i = 0;i < measures.length;i++)
			{
				var measure = measures[i];
				comboBoxData[i] = measure.caption;
			}
			var comboBox = $(window.buildComboBox(comboBoxData,measureIndex));
			comboBox.change(function()
			{
				reportOptions.measureIndex = parseInt($(this).val());
				window.renderReport(reportContainer,reportData,reportOptions)
			});
			window.addOptionPanelInput(optionPanel,"Giá trị",comboBox);
		}
	}
}
/* END XY CHART RENDER */

/* BEGIN TABLE RENDER */
window.renderDataTable = function(reportContainer,reportData,reportOptions,type)
{
	var rollup = reportData.rollup;
	var dimensions = reportData.dimensions;
	var measures = reportData.measures;
	var belongMeasures = [];
	var belongMeasureIndexes = [];
	for(var i = 0;i < dimensions.length;i++)
	{
		var dimension = dimensions[i];
		var correctedMeasures = [];
		var correctedMeasureIndexes = [];
		if(dimension.belongMeasures == null)
			dimension.belongMeasures = [];
		for(var j = 0;j < dimension.belongMeasures.length;j++)
		{
			var mesureName = dimension.belongMeasures[j];
			if(belongMeasures.indexOf(mesureName) < 0)
			{
				for(var k = 0;k < measures.length;k++)
				{
					var measure = measures[k];
					if(measure.name == mesureName)
					{
						belongMeasures.push(mesureName);
						belongMeasureIndexes.push(k);
						correctedMeasures.push(mesureName);
						correctedMeasureIndexes.push(k);
						break;
					}
				}
			}
		}
		dimension.belongMeasures = correctedMeasures;
		dimension.belongMeasureIndexes = correctedMeasureIndexes;
	}
	var data = reportData.data;
	var measurePosition = reportOptions.measurePosition;
	var breakIndex = reportOptions.breakIndex;
	if(breakIndex == null || breakIndex <= 0 || breakIndex > dimensions.length)
	{
		if(breakIndex <= 0)
			breakIndex = dimensions.length + breakIndex;
		else
			breakIndex = dimensions.length;
	}

	var colStruct = [];
	for(var i = breakIndex;i < dimensions.length;i++)
	{
		var colNames = window.getLevelNames(data,i);
		//colNames.sort();
		colStruct[i - breakIndex] = colNames;
	}
	var colSpans = [];
	var measureSpans = [];
	if(measurePosition == 'bottom')
	{
		var span = 1;
		{
			var i = colStruct.length - 1;
			span *= measures.length - belongMeasures.length;
			colSpans[i] = span;
		}
		for(var i = colStruct.length - 2;i >= 0;i--)
		{
			var colCount = colStruct[i + 1].length;
			if(dimensions[i].hideTotal == null ||
			   dimensions[i].hideTotal == false)
			{
				if(colCount > 1)
					colCount++;
			}
			span *= colCount;
			colSpans[i] = span;
		}
	}
	else
	{
		for(var j = 0;j < measures.length;j++)
		{
			if(belongMeasures.indexOf(measures[j].name) >= 0)
				continue;
			var collapse = measures[j].collapse;
			if(collapse == null) collapse = 0;
			measureSpans[j] = 1;
			colSpans[j] = [];
			for(var i = colStruct.length - 1;i >= 0;i--)
			{
				var remain = colStruct.length - i;
				if(collapse > 0 && collapse == remain)
					colSpans[j][i] = 1;
				else
				{
					colSpans[j][i] = measureSpans[j];
					measureSpans[j] *= colStruct[i].length;
					if((collapse > 0 && collapse != remain - 1) || colStruct[i].length > 1)
					{
						if(measures[j].hideTotal == null ||
						   measures[j].hideTotal == false)
							measureSpans[j]++;
					}
				}
			}
		}
	}
	var tableHeader = reportData.tableHeader;
	if(tableHeader == null || tableHeader == '')
	{
		tableHeader = "<thead class='data'><tr>";
		if(reportData.showIndexColumn != null && reportData.showIndexColumn == true)
			tableHeader += "<th rowspan='" + (dimensions.length + 1 - breakIndex) + "'>#</th>";
		var hasMeasureHeader = false;
		for(var i = 0;i < measures.length;i++)
		{
			if(belongMeasures.indexOf(measures[i].name) >= 0)
				continue;
			if(measures[i].caption != null && measures[i].caption != '')
			{
				hasMeasureHeader = true;
				break;
			}
		}
		for(var i = 0;i < breakIndex;i++)
		{
			var dimension = dimensions[i];
			var rowspan = (dimensions.length + 1 - breakIndex - (hasMeasureHeader ? 0 : 1));
			tableHeader += "<th rowspan='" + rowspan + "'>" +
				escapeHtml(dimension.caption) + "</th>";
			for(var bmIndex = 0;bmIndex < dimension.belongMeasures.length;bmIndex++)
			{
				var measureIndex = dimension.belongMeasureIndexes[bmIndex];
				tableHeader += "<th rowspan='" + rowspan + "'>" +
					escapeHtml(measures[measureIndex].caption) + "</th>";
			}
		}
		if(measurePosition == 'bottom')
		{
			var multiple = 1;
			var trs = [];
			for(var i = 0;i < colStruct.length;i++)
			{
				var dimensionIndex = i + breakIndex;
				var dimension = dimensions[dimensionIndex];
				var colNames = colStruct[i];
				var colSpan = colSpans[i];
				var tr = "";
				var fillTotalTH = function()
				{
					if(dimension.hideTotal == null ||
					   dimension.hideTotal == false)
					{
						if(colStruct[i].length > 1)
						{
							var caption = dimension.totalCaption;
							if(caption == null)
								caption = "Total";
							tr += "<th class='total' colspan='" + colSpan + "'>" + escapeHtml(caption) + "</th>";
						}
					}
				}
				if(dimension.totalFirst)
					fillTotalTH();
				for(var j = 0;j < colNames.length;j++)
				{
					var colName = colNames[j];
					var caption = escapeHtml(window.formatDimension(dimension,colName));
					if(dimension.canDrillDown)
					{
						caption = "<a href='javascript:void(0)' class='olap-drilldown' olap-dm='" +
							dimensionIndex + "' olap-value='" + escapeHtml(colName) + "'>" + caption + "</a>";
					}
					tr += "<th colspan='" + colSpan + "'>" + caption + "</th>";
				}
				if(!dimension.totalFirst)
					fillTotalTH();
				if(trs[i] == null) trs[i] = "";
				for(var k = 0;k < multiple;k++)
					trs[i] += tr;
				var colCount = colNames.length;
				if(dimension.hideTotal == null ||
				   dimension.hideTotal == false)
				{
					if(colCount > 1)
						colCount++;
				}
				multiple *= colCount;
			}
			if(hasMeasureHeader)
			{
				var tr = "";
				for(var i = 0;i < measures.length;i++)
				{
					if(belongMeasures.indexOf(measures[i].name) >= 0)
						continue;
					tr += "<th>" + escapeHtml(measures[i].caption) + "</th>";
				}
				if(trs[colStruct.length] == null) trs[colStruct.length] = "";
				for(var k = 0;k < multiple;k++)
					trs[colStruct.length] += tr;
			}
			for(var i = 0;i < trs.length;i++)
			{
				tableHeader += trs[i];
				tableHeader += "</tr><tr>";
			}
			if(tableHeader.endsWith("<tr>"))
				tableHeader = tableHeader.substring(0,tableHeader.length - 4);
			else if(tableHeader.endsWith("</th>"))
				tableHeader = tableHeader.substring(0,tableHeader.length - 5);
			tableHeader += "</thead>";
		}
		else
		{
			if(hasMeasureHeader)
			{
				for(var i = 0;i < measures.length;i++)
				{
					if(belongMeasures.indexOf(measures[i].name) >= 0)
						continue;
					var collapse = measures[i].collapse;
					if(collapse == null) collapse = 0;
					if(collapse > 0 && colStruct.length == 1)
						tableHeader += "<th rowspan='2'>" + escapeHtml(measures[i].caption) + "</th>";
					else
						tableHeader += "<th colspan='" + measureSpans[i] + "'>" + escapeHtml(measures[i].caption) + "</th>";
				}
				tableHeader += "</tr><tr>";
			}
			var trs = [];
			for(var measureIndex = 0;measureIndex < measures.length;measureIndex++)
			{
				if(belongMeasures.indexOf(measures[measureIndex].name) >= 0)
					continue;
				var collapse = measures[measureIndex].collapse;
				if(collapse == null) collapse = 0;
				var multiple = 1;
				for(var i = 0;i < colStruct.length;i++)
				{
					var remain = colStruct.length - i;
					var dimensionIndex = i + breakIndex;
					var dimension = dimensions[dimensionIndex];
					var colNames = colStruct[i];
					var colSpan = colSpans[measureIndex][i];
					var tr = "";
					if((collapse > 0 && collapse == remain - 1) ||
						collapse <= 0 || collapse != remain)
					{
						var fillTotalTH = function()
						{
							if(measures[measureIndex].hideTotal == null ||
							   measures[measureIndex].hideTotal == false)
							{
								if(colStruct[i].length > 1)
								{
									var caption = dimension.totalCaption;
									if(caption == null)
										caption = "Total";
									tr += "<th class='total' rowspan='" + (colStruct.length - i) +
										"'>" + escapeHtml(caption) + "</th>";
								}
							}
						}
						if(measures[measureIndex].totalFirst)
							fillTotalTH();
						if(collapse > 0 && collapse == remain - 1)
						{
							for(var j = 0;j < colNames.length;j++)
							{
								var colName = colNames[j];
								var caption = escapeHtml(window.formatDimension(dimension,colName));
								if(dimension.canDrillDown)
								{
									caption = "<a href='javascript:void(0)' class='olap-drilldown' olap-dm='" +
										dimensionIndex + "' olap-value='" + escapeHtml(colName) + "'>" + caption + "</a>";
								}
								tr += "<th rowspan='" + (collapse + 1) + "'>" + caption + "</th>";
							}
						}
						else
						{
							for(var j = 0;j < colNames.length;j++)
							{
								var colName = colNames[j];
								var caption = escapeHtml(window.formatDimension(dimension,colName));
								if(dimension.canDrillDown)
								{
									caption = "<a href='javascript:void(0)' class='olap-drilldown' olap-dm='" +
										dimensionIndex + "' olap-value='" + escapeHtml(colName) + "'>" + caption + "</a>";
								}
								tr += "<th colspan='" + colSpan + "'>" + caption + "</th>";
							}
						}
						if(!measures[measureIndex].totalFirst)
							fillTotalTH();
					}
					if(trs[i] == null) trs[i] = "";
					for(var k = 0;k < multiple;k++)
						trs[i] += tr;
					multiple *= colNames.length;
				}
			}
			for(var i = 0;i < trs.length;i++)
			{
				tableHeader += trs[i];
				tableHeader += "</tr><tr>";
			}
			if(tableHeader.endsWith("<tr>"))
				tableHeader = tableHeader.substring(0,tableHeader.length - 4);
			else if(tableHeader.endsWith("</th>"))
				tableHeader = tableHeader.substring(0,tableHeader.length - 5);
			tableHeader += "</thead>";
		}
	}

	var totalColName = "${TR}";
	var colSeparator = "|";
	var indexByPath = {};
	var totalByIndex = {};
	var measureByIndex = [];
	if(measurePosition == 'bottom')
	{
		var fillColsPath = function(colStruct,colIndex,path,isTotal)
		{
			if(path == null) path = [];
			if(colIndex < colStruct.length)
			{
				var colDimension = dimensions[colIndex];
				var colNames = colStruct[colIndex];
				var fillTotalPath = function()
				{
					if(colDimension.hideTotal == null ||
					   colDimension.hideTotal == false)
					{
						if(colNames.length > 1)
						{
							path.push(totalColName);
							fillColsPath(colStruct,colIndex + 1,path,true);
							path.pop();
						}
					}
				}
				if(colDimension.totalFirst)
					fillTotalPath();
				for(var j = 0;j < colNames.length;j++)
				{
					var colName = colNames[j];
					path.push(colName);
					fillColsPath(colStruct,colIndex + 1,path,isTotal);
					path.pop();
				}
				if(!colDimension.totalFirst)
					fillTotalPath();
			}
			else
			{
				for(var i = 0;i < measures.length;i++)
				{
					if(belongMeasures.indexOf(measures[i].name) >= 0)
						continue;
					var pathString = path.join(colSeparator);
					if(pathString != '') pathString = colSeparator + pathString;
					pathString = i + pathString;
					indexByPath[pathString] = measureByIndex.length;
					if(isTotal) totalByIndex[measureByIndex.length] = true;
					measureByIndex.push(measures[i]);
				}
			}
		};
		fillColsPath(colStruct,0,[],false);
	}
	else
	{
		var fillColsPath = function(measure,colStruct,colIndex,path)
		{
			var collapse = measure.collapse;
			if(collapse == null) collapse = 0;
			if(path == null) path = [];
			var remain = colStruct.length - colIndex;
			if(colIndex < colStruct.length)
			{
				var colNames = colStruct[colIndex];
				var fillTotalPath = function()
				{
					if(measure.hideTotal == null ||
					   measure.hideTotal == false)
					{
						if(colNames.length > 1 || (collapse > 0 && collapse == remain))
						{
							path.push(totalColName);
							indexByPath[path.join(colSeparator)] = measureByIndex.length;
							totalByIndex[measureByIndex.length] = true;
							measureByIndex.push(measure);
							path.pop();
						}
					}
				}
				if(measure.totalFirst)
					fillTotalPath();
				if(collapse <= 0 || collapse != remain)
				{
					for(var j = 0;j < colNames.length;j++)
					{
						var colName = colNames[j];
						path.push(colName);
						fillColsPath(measure,colStruct,colIndex + 1,path);
						path.pop();
					}
				}
				if(!measure.totalFirst)
					fillTotalPath();
			}
			else
			{
				indexByPath[path.join(colSeparator)] = measureByIndex.length;
				measureByIndex.push(measure);
			}
		};
		for(var i = 0;i < measures.length;i++)
		{
			if(belongMeasures.indexOf(measures[i].name) >= 0)
				continue;
			fillColsPath(measures[i],colStruct,0,[i]);
		}
	}

	var fillRowSpan = function(data,breakIndex,levelIndex,includeData)
	{
		var hasUnfilledTotal = false;
		if(data.total != null)
			hasUnfilledTotal = fillRowSpan(data.total,breakIndex,levelIndex + 1,rollup ? false : includeData);
		if(levelIndex < breakIndex)
		{
			data.span = 0;
			var childCount = 0;
			if(includeData)
			{
				for(var name in data.children)
				{
					var child = data.children[name];
					if(fillRowSpan(child,breakIndex,levelIndex + 1,includeData))
						hasUnfilledTotal = true;
					data.span += child.span;
					childCount++;
				}
			}
			var d = dimensions[levelIndex];
			var hasTotalCaption = d.totalCaption != null && d.totalCaption != '';
			if(hasTotalCaption)
			{
				if(childCount > 1 || hasUnfilledTotal)
				{
					data.span += data.total == null ? 0 : data.total.span;
					data.showTotal = true;
				}
				hasUnfilledTotal = false;
			}
			else if(childCount > 1)
				hasUnfilledTotal = true;
			if(data.span == 0)
				data.span++;
		}
		else
			data.span = 1;
		return hasUnfilledTotal;
	}
	fillRowSpan(data,breakIndex,0,true);

	var tableBody = "";
	var fillRowData = function(valueRow,data,totalFirst)
	{
		for(var i = 0;i < measures.length;i++)
		{
			if(belongMeasures.indexOf(measures[i].name) >= 0)
				continue;
			window.fullRecursiveData(data,null,function(result,path)
			{
				var colPath = path.join(colSeparator);
				var colIndex = indexByPath[colPath];
				if(colIndex != null)
					valueRow[colIndex] = result.data == null ? 0 : result.data[i];
				colIndex = indexByPath[colPath + colSeparator + totalColName];
				if(colIndex != null)
					valueRow[colIndex] = result.data == null ? 0 : result.data[i];
			},[i],totalFirst);
		}
	}
	var rowIndex = 0;
	var tr = "";
	var lastCellIsSingleTotal = false;
	var totalFirst = reportData.totalFirst;
	window.recursiveData(rollup,data,breakIndex - 1,function(result,path)
	{
		var level = path.length - 1;
		if(level >= 0)
		{
			var caption;
			var isTotalRow = path[level] == '${TR}';
			var dimension = dimensions[level];
			if(isTotalRow)
			{
				caption = dimension.totalCaption;
				if(!lastCellIsSingleTotal)
				{
					if(caption == null || caption == '')
						return false;
				}
			}
			else
				caption = window.formatDimension(dimension,path[level]);
			caption = window.escapeHtml(caption);
			if(!isTotalRow && dimension.canDrillDown)
			{
				caption = "<a href='javascript:void(0)' class='olap-drilldown' olap-dm='" +
					level + "' olap-value='" + escapeHtml(path[level]) + "'>" + caption + "</a>";
			}
			if(tr == "")
			{
				if(reportData.showIndexColumn != null && reportData.showIndexColumn == true)
					tr += "<th style='text-align:center;'>" + (rowIndex + 1) + "</th>";
			}
			var rowSpan = (result.span == null ? 1 : result.span);
			var singleTotal = isTotalRow && rowSpan == 1;
			if(!rollup || level <= 0 || !lastCellIsSingleTotal || result.childCount == 0)
			{
				if((rollup && singleTotal) || result.childCount == 0)
				{
					var colspan = (breakIndex - level + dimension.belongMeasures.length);
					for(var lvIndex = level + 1;lvIndex < dimensions.length;lvIndex++)
						colspan += dimensions[lvIndex].belongMeasures.length;
					tr += "<th align='left' valign='top' " + (isTotalRow ? "class='total' " : "") +
						"colspan='" + colspan + "'>" + caption + "</th>";
				}
				else
				{
					tr += "<th align='left' valign='top' " + (isTotalRow ? "class='total' " : "") +
						"rowspan='" + rowSpan + "'>" + caption + "</th>";
					for(var bmIndex = 0;bmIndex < dimension.belongMeasures.length;bmIndex++)
					{
						var measureIndex = dimension.belongMeasureIndexes[bmIndex];
						var bmCaption = window.formatMeasure(measures[measureIndex],result.data[measureIndex]);
						tr += "<th align='left' valign='top' " + (isTotalRow ? "class='total' " : "") +
							"rowspan='" + rowSpan + "'>" + bmCaption + "</th>";
					}
				}
			}
			lastCellIsSingleTotal = singleTotal;
			if(level == breakIndex - 1 || result.childCount == 0)
			{
				var valueRow = new Array(measureByIndex.length);
				fillRowData(valueRow,result,totalFirst);
				for(var i = 0;i < valueRow.length;i++)
				{
					caption = valueRow[i];
					if(caption == null)
						caption = "";
					else
						caption = window.formatMeasure(measureByIndex[i],caption);
					if(totalByIndex[i] || isTotalRow)
						tr += "<td align='right' class='total'>" + caption + "</td>";
					else
						tr += "<td align='right'>" + caption + "</td>";
				}
				tableBody += tr + "</tr><tr>";
				rowIndex++;
				lastCellIsSingleTotal = false;
				tr = "";
				return null;
			}
		}
	},null,null,totalFirst);
	tableBody = tableBody.substring(0,tableBody.length - 4);
	var measureCount = measureByIndex.length;
	if(measureCount <= 0)
		measureCount = measures.length - belongMeasures.length;
	window.renderDataTableContent(tableHeader,tableBody,
		measureCount + breakIndex,reportContainer,reportData,reportOptions,type);
}
window.renderDataTableContent = function(tableHeader,tableBody,
	captionSpan,reportContainer,reportData,reportOptions,type)
{
	if(tableBody != null && tableBody != '')
	{
		if(tableBody.indexOf("<tr>", tableBody.length - 4) >= 0)
			tableBody = tableBody.substring(0,tableBody.length - 4);
		if(tableBody.indexOf("<tr>") != 0)
			tableBody = "<tr>" + tableBody;
	}
	else
		tableBody = "<tr><td colspan='" + captionSpan + "'></td></tr>";
	var dimensions = reportData.dimensions;
	var measurePosition = reportOptions.measurePosition;
	var measurePosition = reportOptions.measurePosition;
	var breakIndex = reportOptions.breakIndex;
	if(breakIndex == null || breakIndex <= 0 || breakIndex > dimensions.length)
	{
		if(breakIndex <= 0)
			breakIndex = dimensions.length + breakIndex;
		else
			breakIndex = dimensions.length;
	}
	if(type == 'excel')
	{
		var html = "<table><thead>";
		var excelHeader = reportData.excelHeader;
		if(excelHeader != null && excelHeader != '')
			html += excelHeader.split("$colspan$").join(captionSpan + "");
		else
		{
			var caption = $("#main_content > .search_form > .caption").text();
			html +=
				"<tr></tr><tr>" +
				"	<th colspan='" + captionSpan + "' align='center' style='font-size:120%;'>" + caption + "</th>" +
				"</tr><tr></tr>";
		}
		html += "</thead>" + tableHeader + "<tbody class='data'>" + tableBody + "</tbody>";
		var excelFooter = reportData.excelFooter;
		if(excelFooter != null && excelFooter != '')
			html += "<tfoot>" + excelFooter.split("$colspan$").join(captionSpan + "") + "</tfoot>";
		html += "</table>";

		var href = window.location.href;
		var qIndex = href.indexOf('?');
		if(qIndex >= 0)
			href = href.substring(0,qIndex);
		href = href.substring(href.lastIndexOf('/') + 1);
		var dotIndex = href.lastIndexOf('.');
		if(dotIndex >= 0)
			href = href.substring(0,dotIndex);
		var table = $(html);
		$.each(table.find(".data td,.data th"), function(i,v){
			v.style.border = "0.5pt solid";
		});
		href += ".xls";
		window.tableToExcel(table[0],href,reportData.excelStyle);
	}
	else
	{
		var extra = reportData.tableExtra;
		if(extra == null)
			extra = "";
		var html = "<div class='olap_table_container'><table class='data_table table table-bordered' " + extra + ">" +
			tableHeader + "<tbody>" + tableBody + "</tbody></table></div>";
		reportContainer.html(html);
		reportContainer.find('.olap-drilldown').click(function()
		{
			var dm = this.getAttribute('olap-dm');
			var value = this.getAttribute('olap-value');
			window.drillDown(reportData,reportOptions,dm,value,this)
		});
		if(dimensions.length > 1 && !reportData.showDataTableOnly && !reportData.hideGroupControl)
		{
			var optionPanel = $("<div class='option_panel'></div>");
			reportContainer.prepend(optionPanel);

			var comboBoxData = {};
			comboBoxData[0] = "Không nhóm";
			for(var i = 1;i < dimensions.length;i++)
				comboBoxData[i] = dimensions[i].caption;
			var comboBox = $(window.buildComboBox(comboBoxData,breakIndex));
			comboBox.change(function()
			{
				reportOptions.breakIndex = parseInt($(this).val());
				window.renderReport(reportContainer,reportData,reportOptions)
			});
			window.addOptionPanelInput(optionPanel,"Nhóm",comboBox);

			comboBoxData = {};
			comboBoxData['top'] = "giá trị/nhóm";
			comboBoxData['bottom'] = "nhóm/giá trị";
			comboBox = $(window.buildComboBox(comboBoxData,measurePosition));
			comboBox.change(function()
			{
				reportOptions.measurePosition = $(this).val();
				window.renderReport(reportContainer,reportData,reportOptions)
			});
			window.addOptionPanelInput(optionPanel,"Hiển thị",comboBox);
		}
	}
}
/* END TABLE RENDER */
window.addOptionPanelInput = function(optionPanel,caption,el)
{
	var group = $("<div class='option'></div>");
	var input = $("<div></div>");
	el.appendTo(input);
	if(caption != null && caption != '')
	{
		var label = $("<label></label>");
		label.text(caption);
		label.appendTo(group);
	}
	input.appendTo(group);
	group.appendTo(optionPanel);
}
window.buildComboBox = function(data,selected)
{
	var html = "<select>";
	for(var i in data)
	{
		html += "<option value='" + escapeHtml(i) + "'" +
			(selected == i ? " selected" : "") +
			">" + escapeHtml(data[i]) + "</option>";
	}
	html += "</select>";
	return html;
}
window.addRenderButton = function(
	reportContainer,reportData,reportOptions,renderPanel,caption,renderType,keepRenderType)
{
	var button = $("<a href='javascript:void(0)'>" + caption + "</a>");
	button.click(function()
	{
		var oldRenderType = reportOptions.render;
		reportOptions.render = renderType;
		window.renderReport(reportContainer,reportData,reportOptions);
		if(keepRenderType)
			reportOptions.render = oldRenderType;
	});
	button.appendTo(renderPanel);
}
window.addRenderPanel = function(reportContainer,reportData,reportOptions)
{
	var renderPanel = $("<div class='render_panel'></div>");
	var dimensionOptions = reportOptions.dm;
	if(dimensionOptions != null)
	{
		var dimensionByName = {};
		for(var i = 0;i < reportData.dimensions.length;i++)
			dimensionByName[reportData.dimensions[i].name] = reportData.dimensions[i];
		for(var dimensionName in dimensionOptions)
		{
			var dimensionOption = dimensionOptions[dimensionName];
			var filter = dimensionOption.f;
			if(filter == null)
				continue;
			var button = $("<a href='javascript:void(0)' dimension-name='" + dimensionName + "' class='filter' title='remove'></a>");
			var filterCaption = "";
			for(var i = 0;i < filter.length;i++)
			{
				var dimension = dimensionByName[dimensionName];
				if(dimension != null)
				{
					if(filterCaption.length > 0)
						filterCaption += "|";
					filterCaption += window.formatDimension(dimension,filter[i].v,filter[i].f,filter[i].t);
				}
			}
			button.text(filterCaption);
			button.click(function()
			{
				delete dimensionOptions[this.getAttribute('dimension-name')];
				reportData.drill();
			});
			button.appendTo(renderPanel);
		}
	}
	window.addRenderButton(reportContainer,reportData,reportOptions,renderPanel,
		"<img src='images/pie_chart.png' title='Pie chart' />","pieChart");
	window.addRenderButton(reportContainer,reportData,reportOptions,renderPanel,
		"<img src='images/line_chart.png' title='Line chart' />","lineChart");
	window.addRenderButton(reportContainer,reportData,reportOptions,renderPanel,
		"<img src='images/area_chart.png' title='Area chart' />","areaChart");
	window.addRenderButton(reportContainer,reportData,reportOptions,renderPanel,
		"<img src='images/column_chart.png' title='Column chart' />","columnChart");
	window.addRenderButton(reportContainer,reportData,reportOptions,renderPanel,
		"<img src='images/bar_chart.png' title='Bar chart' />","barChart");
	window.addRenderButton(reportContainer,reportData,reportOptions,renderPanel,
		"<img src='images/excel_table.png' title='Excel report' />","excel",true);
	window.addRenderButton(reportContainer,reportData,reportOptions,renderPanel,
		"<img src='images/html_table.png' title='HTML report' />","table");
	reportContainer.prepend(renderPanel);
}
window.renderReport = function(reportContainer,reportData,reportOptions)
{
	setTimeout(function()
	{
		if(reportData.afterRenderReport != null)
			reportData.afterRenderReport();
	},1);
	if(reportOptions.render == 'excel')
	{
		window.renderDataTable(reportContainer,reportData,reportOptions,"excel");
		return;
	}
	if(reportOptions.render == 'pieChart')
		window.renderPieChart(reportContainer,reportData,reportOptions);
	else if(reportOptions.render == 'areaChart')
		window.renderXYChart('area',reportContainer,reportData,reportOptions);
	else if(reportOptions.render == 'lineChart')
		window.renderXYChart('line',reportContainer,reportData,reportOptions);
	else if(reportOptions.render == 'columnChart')
		window.renderXYChart('column',reportContainer,reportData,reportOptions);
	else if(reportOptions.render == 'barChart')
		window.renderXYChart('bar',reportContainer,reportData,reportOptions);
	else
		window.renderDataTable(reportContainer,reportData,reportOptions,"html");
	if(!reportData.showDataTableOnly)
		window.addRenderPanel(reportContainer,reportData,reportOptions);
}
window.drillDown = function(reportData,reportOptions,dimensionIndex,dimensionValue,target)
{
	if(reportData.drillDown != null)
	{
		var result = reportData.drillDown(reportData,reportOptions,dimensionIndex,dimensionValue,target);
		if(result == null || result == true)
			return true;
	}
	var dimension = reportData.dimensions[dimensionIndex];
	if(dimension.canDrillDown != true)
		return false;
	var dimensionName = reportData.dimensions[dimensionIndex].name;
	var dimensionOptions = reportOptions.dm;
	if(dimensionOptions == null)
	{
		dimensionOptions = {};
		reportOptions.dm = dimensionOptions;
	}
	var dimensionOption = dimensionOptions[dimensionName];
	if(dimensionOption == null)
	{
		dimensionOption = {l: 0};
		dimensionOptions[dimensionName] = dimensionOption;
	}
	var filter = dimensionOption.f;
	if(filter == null)
	{
		filter = [];
		dimensionOption.f = filter;
	}
	filter[dimensionOption.l] = {v: dimensionValue, f: dimension.format, t: dimension.type};
	if(dimension.canDrillDown)
		dimensionOption.l++;
	reportData.drill();
	return true;
}
$(document)
    .ready(function()
    {
        d3.json('datasets/appstore.json', function(data)
        {

            data.forEach(function(d)
            {
                d.releaseDate = new Date(d.releaseDate);
            });

            var dataset = new insight.DataSet(data);

            var yearly = dataset.group('years', function(item)
            {
                return new Date(item.releaseDate.getFullYear(), 0, 1);
            });

            yearly.mean(['price']);

            var chart = new insight.Chart('Years', '#exampleChart')
                .width(500)
                .height(350)
                .title('Years');

            var x = new insight.Axis('Year', insight.Scales.Ordinal)
                .tickSize(5)
                .tickPadding(5)
                .tickLabelRotation(45)
                .tickLabelFormat(d3.time.format('%Y'));

            var y = new insight.Axis('Avg App Price', insight.Scales.Linear)
                .tickLabelFormat(insight.Formatters.currencyFormatter);

            chart.xAxis(x)
                .yAxis(y);

            var columns = new insight.ColumnSeries('Year', yearly, x, y)
                .valueFunction(function(d)
                {
                    return d.value.price.Average;
                })
                .tooltipFormat(insight.Formatters.currencyFormatter);

            // set ColumnSeries to first color in the default series palette
            // - workaround until ColumnSeries has sub-series removed
            columns.series[0].color = d3.functor(insight.defaultTheme.chartStyle.seriesPalette[0]);

            chart.series([columns]);

            chart.draw();

        });
    });
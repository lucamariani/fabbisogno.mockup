/**
 * Simulates donut charts
 * @param divSelector
 * @param fteasis   the fteasis to plot
 * @param ftetobe   the ftetobe to plot
 */
const makeAslPlot = function(divSelector, fteasis, ftetobe) {
    const data = [{
        values: [15, 12, 6, 5, 4, 42],
        labels: ['USL 1', 'USL 2', 'USL 3', 'USL 4', 'USL 5', 'USL 6'],
        domain: {column: 0},
        name: 'FTE AS IS',
        hoverinfo: 'label+percent+name',
        hole: .4,
        type: 'pie'
    },{
        values: [11, 25, 8, 1, 3, 25],
        labels: ['USL 1', 'USL 2', 'USL 3', 'USL 4', 'USL 5', 'USL 6'],
        text: 'CO2',
        textposition: 'inside',
        domain: {column: 1},
        name: 'FTE TO BE',
        hoverinfo: 'label+percent+name',
        hole: .4,
        type: 'pie'
    }];
    const layout = {
        title: 'FTE per Codici USL 2019',
        annotations: [
            {
                font: {
                    size: 20
                },
                showarrow: false,
                text: 'AS IS',
                x: 0.17,
                y: 0.5
            },
            {
                font: {
                    size: 20
                },
                showarrow: false,
                text: 'TO BE',
                x: 0.84,
                y: 0.5
            }
        ],
        height: 400,
        width: 600,
        showlegend: false,
        grid: {rows: 1, columns: 2}
    };

    Plotly.newPlot(divSelector, data, layout);
}
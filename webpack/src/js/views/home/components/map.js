'use strict';

var d3 = require('d3'),
    topojson = require('topojson'),
    $ = require('jquery');

var ccaTowns = {
    'ACTON': 4,
    'ACUSHNET': 1,
    'ARLINGTON': 2,
    'ASHBY': 1,
    'ATTLEBORO': 1,
    'AQUINNAH': 1,
    'BARNSTABLE': 1,
    'BOSTON': 3,
    'BOURNE': 1,
    'BREWSTER': 1,
    'BROOKLINE': 2,
    'CAMBRIDGE': 2,
    'CARVER': 1,
    'CHATHAM': 1,
    'CHILMARK': 1,
    'CLARKSBURG': 1,
    'DALTON': 1,
    'DARTMOUTH': 1,
    'DEDHAM': 1,
    'DENNIS': 1,
    'DIGHTON': 1,
    'DOUGLAS': 1,
    'DRACUT': 1,
    'EASTHAM': 1,
    'EDGARTOWN': 1,
    'FAIRHAVEN': 1,
    'FALL RIVER': 1,
    'FALMOUTH': 1,
    'FLORIDA': 1,
    'FREETOWN': 1,
    'GLOUCESTER': 2,
    'GREENFIELD': 1,
    'HAMILTON': 3,
    'HARWICH': 1,
    'LANCASTER': 1,
    'LANESBOROUGH': 1,
    'LENOX': 1,
    'LEXINGTON': 2,
    'LOWELL': 1,
    'LUNENBURG': 1,
    'MARION': 1,
    'MARLBOROUGH': 1,
    'MASHPEE': 1,
    'MATTAPOISETT': 1,
    'MELROSE': 3,
    'NATICK': 1,
    'NEW BEDFORD': 1,
    'NEW MARLBOROUGH': 1,
    'NORTH ADAMS': 1,
    'NORTHBRIDGE': 1,
    'NORTON': 1,
    'OAK BLUFFS': 1,
    'ORLEANS': 1,
    'PLAINVILLE': 1,
    'PROVINCETOWN': 1,
    'REHOBOTH': 1,
    'SANDWICH': 1,
    'SALEM': 2,
    'SEEKONK': 1,
    'SHEFFIELD': 1,
    'SOMERSET': 1,
    'SOMERVILLE': 2,
    'SUDBURY': 2,
    'SWAMPSCOTT': 2,
    'SWANSEA': 1,
    'TISBURY': 1,
    'TRURO': 1,
    'TYRINGHAM': 1,
    'WELLFLEET': 1,
    'WEST STOCKBRIDGE': 1,
    'WEST TISBURY': 1,
    'WESTFORD': 1,
    'WESTPORT': 1,
    'WILLIAMSTOWN': 1,
    'WINCHESTER': 2,
    'YARMOUTH': 1
};

function titleCase(name) {
    return name
        .split(' ')
        .map(function(n) {
            return n[0] + n.slice(1).toLowerCase();
        })
        .join(' ');
}

module.exports = function() {
  // Skip if the map isn't visible
  if (!$('#map').is(":visible")) {
    return;
  }

  d3.json('/data/ma-towns.topojson', function(err, topology) {

    // Convert the topojson to geojson
    var geojson = topojson.feature(topology, topology.objects.towns),
        path = d3.geo.path().projection(null);

    d3.select('#map')
        .append('svg').attr({width: 615, height: 375})
        .append('g')
        .attr({'class': 'g-town'})
        .selectAll('path.town')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr({
            'class': function(d) {
                var cca = ccaTowns[d.properties.town];
                switch(cca) {
                    case 1:
                        return 'town town-green';
                    case 2:
                        return 'town town-dark-green';
                    case 3:
                        return 'town town-orange';
                    case 4:
                        return 'town town-gray';
                    default:
                        return 'town';
                }
            },
            'data-town': function(d) {
                return d.properties.town;
            },
            d: path
        })
        .append('svg:title')
        .text(function(d) {
            return titleCase(d.properties.town);
        });
        $('.town').hover(function(el) {
            var town = $(el.currentTarget).data('town');
            $('#town-name').html(titleCase(town));
        }, function() {
            $('#town-name').html('');
        });

        /*
         * Map legend
         */
        var legendText = [
            'Participating in a CCE with extra renewables',
            'Participating in a CCE',
            'Planning a CCE',
            'Proposed'
        ];

        var color = d3.scale.ordinal().range([
            '#cfcfcf',
            'orange',
            '#8BB381',
            'green'
        ]);

        color.domain([0,1,2,3]); // setting the range of the input data

        var legend = d3.select('#legend').append('svg')
            .attr('class', 'legend')
            .attr('width', 320)
            .attr('height', 80)
            .selectAll('g')
            .data(color.domain().slice().reverse())
            .enter()
            .append('g')
            .attr('transform', function(d, i) {
                return 'translate(0,' + i * 20 + ')';
            });

        legend.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .style({stroke: 'gray', fill: color});

        legend.append('text')
            .data(legendText)
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .text(function(d) { return d; });
  });
};

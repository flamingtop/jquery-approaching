# jQuery mouse approaching plugin/event

Simulate mouse approaching event, fired everytime the mouse cursor gets close enough to the listened element.

## Usage 

**as a plugin**
    
    $('#foo').approaching(function(ev) { // approaching detected, do something });
    
    $('#foo').approaching(function(ev) {
        // do something
    }, {threshhold: [30, 100, 50, 10]});
    
**as a special event**    

    $('#foo').on('approaching', function(ev) {
        // do something
    });
    
    $('#foo').on('approaching', {threshhold: [30, 100, 50, 10]}), function(ev) {
        // do something
    });
    
## Options 

    threshhold: [top, right, bottom, left]

## Dependencies

jQuery 1.4+


var sass = require('node-sass');
sass.render({
    file: 'style.scss',
    success: function(){console.log('should be style success')}
});
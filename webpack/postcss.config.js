module.exports = {
  //parser: false,//'sugarss',//css缩进规则
  ident: 'postcss',
  plugins: [
    //require('precss'),
    require('autoprefixer')({
	    browsers: ['ios >= 7.0']
    }),
    // require('postcss-sprites')({
    //   spritePath:'dist/static/assest/sprite'
    // })
  ]
}
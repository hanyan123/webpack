const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack'); //to access built-in plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");//提取css打包
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');//去掉没用的js
const PurifyCSSPlugin = require('purifycss-webpack'); //css 压缩 去掉没用css
const glob = require('glob-all');
//const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');
//const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
module.exports = {
  	entry: { 'app':'./src/app.js'},
  	output: {
	    path: path.resolve(__dirname, './dist/'),
        filename: 'js/[name].js',
        chunkFilename:'js/[name].js',
        publicPath:'../dist/'
        //publicPath:'/'
    },
    //引入第三方库
    resolve:{
        alias:{
            jquery$:path.resolve(__dirname,'src/libs/jquery.js')
        }
    }, 
  	module: {
	  	rules: [
	    	{ 
	    		test: /\.js$/,
	    		exclude: /node_modules/, 
	    		loader: "babel-loader" 
            },
	    	
			{
                test: /\.css$/,
                //提取单独的css文件
                //use: [ 'style-loader/url', 'file-loader' ]
                use:ExtractTextPlugin.extract({
                    fallback: {
                        loader:"style-loader",
                        options:{
                            //insertInto:"#app",
                            singleton:true,
                            //transform:'./css.transform.js'
                        }
                    },
                    use: [ 
                        {
                            loader:'css-loader',
                            options:{
                                //minimize:true,
                                //modules: true,
                                //localIdentName: '[path][name][hash:base64:5]'
                            }
                        },
                        {
                            loader:'postcss-loader'    
                        }
                    ]
                })
		   	},
		   	{
		      test: /\.less$/,
		      use: ExtractTextPlugin.extract({
                    fallback: {
                        loader:"style-loader",
                    },
                    use:[ 
                        {
                            loader:'css-loader',
                            options:{
                                //minimize:true,
                                //modules: true,
                                //localIdentName: '[path][name][hash:base64:5]'
                            }
                        },
                        {
                            loader:'postcss-loader'    
                        },
                        {
                            loader:'less-loader'
                        },
                            
                    ]
                })
              
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                //   {
                //     loader: 'file-loader',
                //     options:{
                //         outputPath:'dist/',
                //         publicPath:'',
                //         useRelativePath:true    
                //     }
                //   }
                    {
                        loader: 'url-loader',
                        options:{
                            limit:100,
                            name:"images/[hash:8].[name].[ext]",
                            //outputPath:"images/",
                            publicPath:'../',
                            //useRelativePath:true    
                        }
                    },
                    // {
                    //     loader: 'img-loader',
                    //     options:{
                    //         pngquant:{
                    //             quality:80   
                    //         },
                    //     }
                    // }
                ]
            },
            {
                test:/\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src','img:data-src'],
                        name:"images/[hash:8].[name].[ext]",
                        //publicPath:'../'
                    }
                }
            },
            {
                test:path.resolve(__dirname,'src/app.js'),
                use:[
                    {
                        loader:'imports-loader',
                        options:{
                            $:'jquery'
                        }
                    }
                ]
            }
	  	]
    },
  	plugins: [
    	new webpack.ProgressPlugin(),
    	new HtmlWebpackPlugin(
	    	{
	    		template: 'index.html',
                filename:'index.html',
                //chunks:['app'],
	    		inject:true
	    	}
        ),
        // new webpack.optimize.SplitChunksPlugin({
        //     chunks: "all", 
        //     minSize: 0,   
        //     name: 'manifest',      
        //     minChunks: 1,
        // }),
        //提取css文件
        new ExtractTextPlugin({
            filename:"css/[name].min.css",
            //allChunks:false
        }),
        //去掉没用的css
        new PurifyCSSPlugin({
             // 
             paths: glob.sync([ // 传入多文件路径
                path.join(__dirname, 'src/*.html'),
                path.join(__dirname, 'src/*js')
            ])

        }),
        new CleanWebpackPlugin(['dist']),
        //去掉没用的js
        new UglifyJsPlugin({
            test: /\.js($|\?)/i
        }),
        //把重复js插入到页面中
        new InlineManifestWebpackPlugin('manifest')
        //new InlineChunkManifestHtmlWebpackPlugin()
        // new InlineChunkWebpackPlugin({
        //     inlineChunks: ['manifest']
        // }),
        //提取重复的代码
        
        //全局注册暴露$符号
        // new webpack.ProvidePlugin({
        //     $:'jquery'
        // })
      ],
      //提取公共js配置
        optimization :{
            splitChunks: {
                chunks: "all", 
                minSize: 0,   
                name: 'manifest',      
                minChunks: 1,             
            }
        }
};
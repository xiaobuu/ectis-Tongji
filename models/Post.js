var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
    label:'文章'
});

Post.add({
	title: {label: '标题', type: String, required: true },
    state: {label: '状态', type: Types.Select, options: '草稿, 已发布, 已存档', default: '草稿', index: true },
	publishedDate: {label: '发布日期', type: Types.Date, index: true, dependsOn: { state: '已发布' }},
	content: {
		brief: {label: '简要内容', type: Types.Html, wysiwyg: true, height: 150 },
		extended: {label: '详细内容', type: Types.Html, wysiwyg: true, height: 400 }
	},
    categories: {label: '类别', type: Types.Relationship, ref: 'PostCategory', index: true,required:true,initial:true},
    file : {label:'文件', type: Types.LocalFile,dest: __dirname+'/../public/files', prefix: '/files'},
	image : {label:'封面图片',
		type: Types.LocalFile,
		dest: __dirname+'/../public/files/images',
		prefix: '/files/images',
		allowedTypes:['image/jpeg','image/pjpeg','image/png'],
		datePrefix: 'YYYYMMDDhmmss',
		format: function(item, file){
			return '<img src="/files/images/'+file.filename+'" style="max-width: 300px">'
		}
	}
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.defaultSort = '-publishedDate';

Post.defaultColumns = 'title, state|20%, categories|20%, publishedDate|20%';
Post.register();

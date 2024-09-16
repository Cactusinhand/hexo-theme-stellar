/**
 * toc.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% toc wiki:xxx [title] [open:true] [display:mobile] %}
 */

'use strict'

function layoutDocTree(ctx, pages, wikiName) {
  const url_for = require('hexo-util').url_for.bind(ctx)
  // 辅助函数：确保 URL 正确拼接
  function joinUrl(base, path) {
    if (base.endsWith('/') && path.startsWith('/')) {
      return base + path.slice(1)
    } else if (!base.endsWith('/') && !path.startsWith('/')) {
      return base + '/' + path
    } else {
      return base + path
    }
  }

  var el = ''
  el += '<ul class="toc">'
  pages.forEach((p, i) => {
    let href
    if (p.path.startsWith(wikiName + '/')) {
      // 如果路径已经以 wikiName 开头，直接使用
      href = url_for(p.path)
    } else {
      // 否则，添加 wikiName 前缀
      href = url_for(wikiName + '/' + p.path)
    }
    // 使用 ctx.config.url 作为基础 URL
    href = joinUrl(ctx.config.url, href)
    // console.log("href", href)
    el += '<li>'
    el += '<a class="list-link" href="' + href + '">'
    el += '<span>' + p.title + '</span>'
    el += '</a>'
    el += '</li>'
  })
  el += '</ul>'
  return el
}

module.exports = ctx => function(args) {
  args = ctx.args.map(args, ['wiki', 'open', 'display'], ['title'])

  var el = ''
  el += '<div class="tag-plugin toc"'
  el += ' ' + ctx.args.joinTags(args, ['display']).join(' ')
  if (args.display === 'mobile') {
    el += ' style="display:none"'
  }
  el += '>'

  el += '<details class="toc"'
  if (args.open != 'false') {
    el += ' open'
  }
  el += '>'
  el += '<summary>'
  el += args.title || 'TOC'
  el += '</summary>'

  if (args.wiki) {
    const proj = ctx.theme.config.wiki.tree[args.wiki]
    if (proj == undefined) {
      return ''
    }
    if (proj.sections && proj.sections.length > 1) {
      el += '<div class="body fs14 multi">'
      proj.sections.forEach((sec, i) => {
        el += '<section>'
        el += '<div class="header">'
        el += sec.title
        el += '</div>'
        el += layoutDocTree(ctx, sec.pages, args.wiki)
        el += '</section>'
      })
      el += '</div>'
    } else {
      el += '<div class="body fs14">'
      el += '<div class="body">'
      el += layoutDocTree(ctx, proj.pages, args.wiki)
      el += '</div>'
      el += '</div>'
    }
  }
  el += '</details>'
  // end
  el += '</div>'
  return el
}
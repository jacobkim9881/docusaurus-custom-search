import React, { useState, useEffect } from 'react'
import lunr from 'lunr'
//import Doc1 from '../../docs/create-a-blog-post.md'
import ReactDOMServer from 'react-dom/server'
import md2json from 'md-2-json'
import html2md from 'html-to-md'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
const path = require('path');
import useGlobalData from '@docusaurus/useGlobalData';
import fs from 'fs'
import ReactMd from 'react-md-file';
import route from '../../.docusaurus/routes'
import client from '../../.docusaurus/client-manifest.json'
import lurnr, {idx as testtt} from './Lurn.js'
import classnames from "classnames";

function SearchBar() {
const [mdPaths, setMdPath] = useState([]);
const [mdRaws, setMdRaw] = useState([]);
const [isBarExpanded, setBar] = useState(false);

function loadSearch() {
	let origins = Object.keys(client.origins);
let sites = [];	
  origins.forEach(site => {
    let format = site.slice(-4);
    let rawPath = site.slice(6);	  
    if (format.includes('.md') || format.includes('.mdx')) {      	    
      sites.push(rawPath);
    }
  })	
 setMdPath(sites);
 let raws = [];
 let head = '#';	
 sites.map(path => {
 let pathArr = path.split('/');	 
 let folder = path.split('/')[0];
 let pathEnd = path.split('/')[pathArr.length - 1];	
 let blogPathEnd = pathEnd.match(/([a-z]+\-.+\w+)|(\w+.md)|(\w+.mdx)/i)[0]; 
 blogPathEnd = blogPathEnd.replace(/(.mdx)|(.md)/, '');
 let isBlog = folder === 'blog' ? true : false; 
 let isSrc = folder !== 'blog' && folder !== 'docs' ? true : false;	
 let rawHead = isBlog ? routePaths(blogPathEnd) : isSrc ? pathEnd.replace(/(.mdx)|(.md)/, '') : path.replace(/(.mdx)|(.md)/, '') ;
//console.log('rawHead: ',rawHead);
//	 console.log(pathEnd);
 let fullPath = '../../'+ path;
  fetch(fullPath).then(res => res.text())
    .then(md => {
      let from = 0;
      let hashAt;	   
      for(let i=0; i < md.length; i++) {
        if (md[i] === '\n'&& md[i+1] !== '\n') {
 let raw = {"head":'', "text": ''};	

       if (i > hashAt && hashAt === from) {
	  let strHash = md.slice(from, i);
//		 console.log(strHash)
	  strHash = strHash.split('{')[0];
 	  strHash = strHash.toLowerCase();		
  	 let strToPath = strHash.replace(/[#]\s/g, '#');
	  strToPath = strToPath.trim();	
//		console.log(strToPath);
	  strToPath = strToPath.replace(/(')|([?])|([!])|([$])|([&])|([(])|([)])|([*])|([+])|([,])|([;])|([=])/g, '');		
	  strToPath = strToPath.replace(/(:)|(\s)|(@)/g, '-');		
          strToPath = strToPath.replace(/[-]+/g, '-');		
//		console.log(strToPath);
 let hashT = strHash.match(/#+/);	  		
          rawHead = isBlog ? routePaths(blogPathEnd) + strToPath : isSrc ? pathEnd.replace(/(.mdx)|(.md)/, '') + strToPath : path.replace(/(.mdx)|(.md)/, '') + strToPath;
//	console.log('rawHead for blog: ', rawHead);
//	       console.log('blog path end: ', blogPathEnd);
//	       console.log('isSrc: ',isSrc);
       //		 console.log(hashT);
//            if (head.length < hashT.length) {
	      head = hashT;
//	    }
	    
	}
	
	let rawText = md.slice(from, i);
rawText = rawText.replace(/(\[)|(\])|([(].+[)])|(<(“[^”]*”|'[^’]*’|[^'”>])*>)|(\n)|([{]\s?#+.+[}])/g, '');
		raw.head = rawHead;
		raw.text = rawText;
//		console.log(raw);
	        raws.push(raw);
        from = i + 1;		
	}
          if (md[i] === '#' && md[i-1] === '\n' || md[i] === '#' && hashAt === undefined) {
 	  hashAt = i;		  
//		 console.log('#')
	   }    
      }
//	    console.log(raws.length)
//console.log(raws);	    
    })
 })
	setMdRaw(raws);
//	 console.log('effect: ', raws);
}
	
function routePaths(target) {
  let paths = [];
  let path;	
  route.forEach(obj => {
  let pathArr = obj.path.split('/');	  
  if (obj.path.indexOf(target) !== -1) {
  path = obj.path.slice(1);	  
  }
/*
  if(pathArr.length > 2 && pathArr[2] !== 'tags' && path.slice(0,5) === '/blog') {
  paths.push(path); 
  console.log(pathArr);
  }
	  */
  })
  return path;
}

function handleSearch(e) { 
 const idx = lunr(function() {
this.ref('head');
this.field('text');
this.metadataWhitelist = ['position'];
//console.log('hook: ',mdPaths)
mdRaws.forEach(function(raw) {
this.add(raw);
}, this);	
});
let result = idx.search(e.target.value)	
console.log(idx.search(e.target.value));
  if(result.length >0) {
  setBar(true);
  } else {
  setBar(false);
  }

let expanded = document.querySelector('.search-bar-expanded');
let dropdown = document.querySelector('.dropdown');
  if (expanded !== null) {
expanded.appendChild()
  }
console.log(expanded);	
}

function test() {

//console.log(raws)
 let docs = '../../blog/2019-05-28-hola.md';  	
//  fetch(docs).then(res => res.text())
//	.then(data => console.log(data))
//  let str = ReactDOMServer.renderToString(<Doc1/>);
//  const md = html2md(str, {emptyTags:['code', 'blockquote']});
/*
  let idx = lunr(function () {
  this.ref('name')
  this.field('text')
  this.metadataWhitelist = ['position'];
  let arrMd = md.split('\n');
  arrMd.forEach(data => {
	  let obj = {name: 'd', text: data}
	  this.add(obj);
  })
 });
	*/
//	  console.log(md);
//  let arrMd = md.split('\n');
//console.log(arrMd);
let jsn = md2json.parse('dd');
//	  console.log(jsn);
//  console.log(idx.search("Greetings"));  	  
  }

    return <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
	className={classnames("search-icon", {
          "search-icon-hidden": isBarExpanded
        })}
 	tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={classnames(
          "navbar__search-input",
          { "search-bar-expanded": isBarExpanded },
          { "search-bar": !isBarExpanded }
        )}
	onClick={loadSearch}
        onMouseOver={loadSearch}
	onChange={handleSearch}
      />
	<span class={classnames("hide", "dropdown")}>hello</span>
    </div>
}

export default SearchBar;

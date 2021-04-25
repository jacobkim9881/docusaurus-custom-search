import React, { useState, useEffect } from 'react'
import lunr from 'lunr'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useGlobalData from '@docusaurus/useGlobalData';
import route from '../../../.docusaurus/routes'
import client from '../../../.docusaurus/client-manifest.json'
import classnames from "classnames";
import './searchbar.css'

function SearchBar() {
const [mdPaths, setMdPath] = useState([]);
const [mdRaws, setMdRaw] = useState([]);
const [isBarExpanded, setBar] = useState(false);
const [searchResult, setSearchRes] = useState([]);

// This loads paths to parse .md or .mdx format files to search
function loadSearch() {	
//	console.log('mdRaws length: ',mdRaws.length)
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
//	console.log('path: ',path)
 let fullPath = '../../../'+ path;
  fetch(fullPath).then(res => res.text())
    .then(md => {
      let from = 0;
      let hashAt;	   
      for(let i=0; i < md.length; i++) {
        if (md[i] === '\n'&& md[i+1] !== '\n') {
 let raw = {"id": 0, "head":'', "text": ''};	

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
//		console.log('raw: ',raw);
		raw.id = raws.length === 0 ? 0 : raws.length;		
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

//This loads paths of blogs for parsing .md or .mdx
//blog md files have date in the name which can't parsed with loadSearch function
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

//This making search when keywords on search bar tag are put
//by putting values this makes lunr find results at parsed .md files
//and set results on React state
function handleSearch(e) {
  setSearchRes([]);	  
 const idx = lunr(function() {
this.ref('id');
this.field('text');
this.metadataWhitelist = ['position'];
//console.log('hook: ',mdPaths)
mdRaws.forEach(function(raw) {
this.add(raw);
}, this);	
});
let results = e.target.value !== "" ? idx.search(e.target.value) : [];
//console.log(idx.search(e.target.value));
//console.log('search result: ', searchResult);
//  let resultRaw = document.querySelector('.result-raw');
//		resultRaw.remove();		

setBar(true);
setSearchRes(results);	  

let expanded = document.querySelector('.search-bar-expanded');
let dropdown = document.querySelector('.dropdown');
let navSearch = document.querySelector('.navbar__search');
  if (expanded !== null) {
dropdown.style.display = 'block';
navSearch.style.position = 'relative';	  
	  
//	  console.log(mdRaws);
  }
//console.log(expanded);	
dropdown.style.display = 'hide';
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
	onClick={(e) => mdRaws.length === 0 ? loadSearch(e) : ""}
        onMouseOver={(e) => mdRaws.length === 0 ? loadSearch(e) : ""}
	onChange={handleSearch}
      />
	<table className={"search-table"}>
	<tbody className={classnames("hide", "dropdown")}>
	{  searchResult.map((result, id) => {
  //This showing lists from state of search results		
  let rawIdx = parseInt(result.ref);
  let rawHead = mdRaws[rawIdx].head;
  let headTitle = rawHead.split('/');
  headTitle = headTitle[headTitle.length - 1];
  headTitle = headTitle.indexOf('-') !== -1 ? headTitle.replace('-', ' ') : headTitle;	  
	  console.log(headTitle);
  let rawText = mdRaws[rawIdx].text;

    return <tr className={"result-raw"} onClick={() => {window.location.href='/' + rawHead}} key={id}>
	       <td className={"result-td-header"}>
	         <p> {headTitle}
		 </p>			
	       </td>	
	       <td className={"result-td-data"}>
		 <p> {rawText}
		 </p>			
	       </td>			
           </tr>		
	})}	  
</tbody>
</table>	
    </div>
}

export default SearchBar;

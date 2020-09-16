/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app/content.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app/content.ts":
/*!****************************!*\
  !*** ./src/app/content.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

// TODO figure out a way to get these rules from the server
const hostRules = {
    'jobs.lever.co': (data) => {
        data.company = data.company.replace(' Home Page', '').trim();
        data.location = data.location.replace(' /', '').trim();
        return data;
    },
    'boards.greenhouse.io': (data) => {
        data.company = data.company.replace('at ', '').trim();
        return data;
    },
    'www.indeed.com': (data) => {
        data.role = data.role.replace('- job post', '').trim();
        return data;
    }
};
const sanitize = (host, data) => {
    return hostRules[host] ? hostRules[host](data) : data;
};
const exceptions = {
    'indeed.com/jobs': (request) => {
        const iframeContents = $('#vjs-container-iframe').contents();
        const data = {
            company: iframeContents.find(request.rules.company).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            role: iframeContents.find(request.rules.role).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            location: iframeContents.find(request.rules.location).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            body: iframeContents.find("body").html(),
            description: iframeContents.find(request.rules.description).text(),
            description_html: iframeContents.find(request.rules.description).html(),
            logo: iframeContents.find(request.rules.logo).attr('src')
        };
        return data;
    }
};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "getData") {
        const data = exceptions[request.rules.root_url] ? exceptions[request.rules.root_url](request) : {
            company: $(request.rules.company).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            role: $(request.rules.role).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            location: $(request.rules.location).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            body: $("body").html(),
            description: $(request.rules.description).text(),
            description_html: $(request.rules.description).html(),
            logo: $(request.rules.logo).attr('src')
        };
        sendResponse({ data: sanitize(window.location.hostname, data) });
    }
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSwyREFBMkQ7QUFDM0QsTUFBTSxTQUFTLEdBQUc7SUFDaEIsZUFBZSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0Qs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QUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsRUFBRSxFQUFFLENBQUM7WUFDeEYsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsRUFBRSxFQUFFLENBQUM7WUFDaEcsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDdEIsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNoRCxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDckQsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDeEMsQ0FBQztRQUVGLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2xFO0FBQ0gsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2FwcC9jb250ZW50LnRzXCIpO1xuIiwiLy8gVE9ETyBmaWd1cmUgb3V0IGEgd2F5IHRvIGdldCB0aGVzZSBydWxlcyBmcm9tIHRoZSBzZXJ2ZXJcbmNvbnN0IGhvc3RSdWxlcyA9IHtcbiAgJ2pvYnMubGV2ZXIuY28nOiAoZGF0YSkgPT4ge1xuICAgIGRhdGEuY29tcGFueSA9IGRhdGEuY29tcGFueS5yZXBsYWNlKCcgSG9tZSBQYWdlJywgJycpLnRyaW0oKTtcbiAgICBkYXRhLmxvY2F0aW9uID0gZGF0YS5sb2NhdGlvbi5yZXBsYWNlKCcgLycsICcnKS50cmltKCk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICdib2FyZHMuZ3JlZW5ob3VzZS5pbyc6IChkYXRhKSA9PiB7XG4gICAgZGF0YS5jb21wYW55ID0gZGF0YS5jb21wYW55LnJlcGxhY2UoJ2F0ICcsICcnKS50cmltKCk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICd3d3cuaW5kZWVkLmNvbSc6IChkYXRhKSA9PiB7XG4gICAgZGF0YS5yb2xlID0gZGF0YS5yb2xlLnJlcGxhY2UoJy0gam9iIHBvc3QnLCAnJykudHJpbSgpO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG5cbmNvbnN0IHNhbml0aXplID0gKGhvc3QsIGRhdGEpID0+IHtcbiAgcmV0dXJuIGhvc3RSdWxlc1tob3N0XSA/IGhvc3RSdWxlc1tob3N0XShkYXRhKSA6IGRhdGE7XG59XG5cbmNvbnN0IGV4Y2VwdGlvbnMgPSB7XG4gICdpbmRlZWQuY29tL2pvYnMnOiAocmVxdWVzdCkgPT4ge1xuICAgIGNvbnN0IGlmcmFtZUNvbnRlbnRzID0gJCgnI3Zqcy1jb250YWluZXItaWZyYW1lJykuY29udGVudHMoKTtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgY29tcGFueTogaWZyYW1lQ29udGVudHMuZmluZChyZXF1ZXN0LnJ1bGVzLmNvbXBhbnkpLnRleHQoKS50cmltKCkucmVwbGFjZSgvXlteYS16QS1aMC05XSp8W15hLXpBLVowLTkpXSokL2csICcnKSxcbiAgICAgIHJvbGU6IGlmcmFtZUNvbnRlbnRzLmZpbmQocmVxdWVzdC5ydWxlcy5yb2xlKS50ZXh0KCkudHJpbSgpLnJlcGxhY2UoL15bXmEtekEtWjAtOV0qfFteYS16QS1aMC05KV0qJC9nLCAnJyksXG4gICAgICBsb2NhdGlvbjogaWZyYW1lQ29udGVudHMuZmluZChyZXF1ZXN0LnJ1bGVzLmxvY2F0aW9uKS50ZXh0KCkudHJpbSgpLnJlcGxhY2UoL15bXmEtekEtWjAtOV0qfFteYS16QS1aMC05KV0qJC9nLCAnJyksXG4gICAgICBib2R5OiBpZnJhbWVDb250ZW50cy5maW5kKFwiYm9keVwiKS5odG1sKCksXG4gICAgICBkZXNjcmlwdGlvbjogaWZyYW1lQ29udGVudHMuZmluZChyZXF1ZXN0LnJ1bGVzLmRlc2NyaXB0aW9uKS50ZXh0KCksXG4gICAgICBkZXNjcmlwdGlvbl9odG1sOiBpZnJhbWVDb250ZW50cy5maW5kKHJlcXVlc3QucnVsZXMuZGVzY3JpcHRpb24pLmh0bWwoKSxcbiAgICAgIGxvZ286IGlmcmFtZUNvbnRlbnRzLmZpbmQocmVxdWVzdC5ydWxlcy5sb2dvKS5hdHRyKCdzcmMnKVxuICAgIH07XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICBpZiAocmVxdWVzdC5hY3Rpb24gPT0gXCJnZXREYXRhXCIpIHtcbiAgICBjb25zdCBkYXRhID0gZXhjZXB0aW9uc1tyZXF1ZXN0LnJ1bGVzLnJvb3RfdXJsXSA/IGV4Y2VwdGlvbnNbcmVxdWVzdC5ydWxlcy5yb290X3VybF0ocmVxdWVzdCkgOiB7XG4gICAgICBjb21wYW55OiAkKHJlcXVlc3QucnVsZXMuY29tcGFueSkudGV4dCgpLnRyaW0oKS5yZXBsYWNlKC9eW15hLXpBLVowLTldKnxbXmEtekEtWjAtOSldKiQvZywgJycpLFxuICAgICAgcm9sZTogJChyZXF1ZXN0LnJ1bGVzLnJvbGUpLnRleHQoKS50cmltKCkucmVwbGFjZSgvXlteYS16QS1aMC05XSp8W15hLXpBLVowLTkpXSokL2csICcnKSxcbiAgICAgIGxvY2F0aW9uOiAkKHJlcXVlc3QucnVsZXMubG9jYXRpb24pLnRleHQoKS50cmltKCkucmVwbGFjZSgvXlteYS16QS1aMC05XSp8W15hLXpBLVowLTkpXSokL2csICcnKSxcbiAgICAgIGJvZHk6ICQoXCJib2R5XCIpLmh0bWwoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAkKHJlcXVlc3QucnVsZXMuZGVzY3JpcHRpb24pLnRleHQoKSxcbiAgICAgIGRlc2NyaXB0aW9uX2h0bWw6ICQocmVxdWVzdC5ydWxlcy5kZXNjcmlwdGlvbikuaHRtbCgpLFxuICAgICAgbG9nbzogJChyZXF1ZXN0LnJ1bGVzLmxvZ28pLmF0dHIoJ3NyYycpXG4gICAgfTtcblxuICAgIHNlbmRSZXNwb25zZSh7IGRhdGE6IHNhbml0aXplKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSwgZGF0YSkgfSk7XG4gIH1cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==
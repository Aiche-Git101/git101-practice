/** removes item from array by value
 * @param {array} arr
 * @param {element} element
 * @returns {array} array
 */
function removeA(arr){
    let what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}


// regex match text against array of keywords
const contains_kw = (expression, skw = []) => {
    // make everything uppercase first (easier to match)
    const kws = (!skw ||!skw.length)? keywords.map(k => k.value.toUpperCase()) : skw.map(s => keywords[s].value.toUpperCase());

    // if expression contains any of the keywords return true
    const re = new RegExp(kws.map(k => "\\b" + k).join("|"), "g"); // format -> /\bkeyword0|\bkeyword1|\bkeyword2/g
    return re.test(expression.toUpperCase());
}


/** escape double quotes in string
 * @param {string} str target string
 * returns {string}
 */
const escape_dq = str => str.replace(/\\([\s\S])|("|')/g,"\\$1$2"); // thanks @slevithan!

/** escape HTML string
 * @param {string} html_str HTML string
 * reurns {string}
 */
const escape_HTML = html_str =>{
    return html_str.replace(/[&<>"]/g, function (tag) {
        const chars_to_replace = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"'
        };
        return chars_to_replace[tag] || tag;
    });
}


/** difference(delta) between 2 objects
  * @param {object} v1 first object
  * @param {object} v2 second object
  * return {array}
  */
const diffObjs = (v1, v2)=>{

    // return NULL when passed references to
    // the same objects or matching scalar values
    if (v1 === v2) {
        return null;
    }
    let cloneIt = function(v) {
        if (v == null || typeof v != 'object') {
            return v;
        }

        let isArray = Array.isArray(v);

        let obj = isArray ? [] : {};
        if (!isArray) {
            // handles function, etc
            Object.assign({}, v);
        }

        for (let i in v) {
            obj[i] = cloneIt(v[i]);
        }

        return obj;
    }

    // different types or array compared to non-array
    if (typeof v1 != typeof v2 || Array.isArray(v1) != Array.isArray(v2)) {
        return [cloneIt(v1), cloneIt(v2)];
    }

    // different scalars (no cloning needed)
    if (typeof v1 != 'object' && v1 !== v2) {
        return [v1, v2];
    }

    // one is null, the other isn't
    // (if they were both null, the '===' comparison
    // above would not have allowed us here)
    if (v1 == null || v2 == null) {
        return [cloneIt(v1), cloneIt(v2)]; 
    }

    // We have two objects or two arrays to compare.
    let isArray = Array.isArray(v1);

    let left = isArray ? [] : {};
    let right = isArray ? [] : {};

    for (let i in v1) {
        if (!v2.hasOwnProperty(i)) {
            left[i] = cloneIt(v1[i]);
        } else {
            let sub_diff = diffObjs(v1[i], v2[i]);
            // copy the differences between the 
            // two objects into the results.
            // - If the object is array, use 'null'
            //   to indicate the two corresponding elements
            //   match.
            //
            // - If the object is not an array, copy only
            //   the members that point to an unmatched
            //   object.
            if (isArray || sub_diff) { 
                left[i] = sub_diff ? cloneIt(sub_diff[0]) : null;
                right[i] = sub_diff ? cloneIt(sub_diff[1]) : null;
            }
        }
    }

    for (let i in v2) {
        if (!v1.hasOwnProperty(i)) {
            right[i] = cloneIt(v2[i]);
        }
    }

    return [ left, right];
};

/*
 * @param {array} arr array
 * @returns {any} last element in array
 */
const arr_last = arr => arr[arr.length - 1];

/** adds element to beginning of array and returns the array
 * @param {element} value 
 * @param {array} array
 */
const prepend = (value, array)=>{
    let newArray = array.slice();
    newArray.unshift(value);
    return newArray;
}
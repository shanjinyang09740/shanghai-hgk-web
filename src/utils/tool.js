/**
 * @description 复杂对象数组去重---根据数组中对象的某个属性进行过滤
 * @param {Array} arr 传入的数组
 * @param {String} arr 传入的属性
 */
 export const arrDistinctByProp = (arr,prop) => {
    return arr.filter(function(item,index,self){
        return self.findIndex(el=>el[prop]==item[prop])===index
    })
}

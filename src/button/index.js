//  前端本地按钮对照表
import {asyncButtonsMap} from "@/button/asyncButtonsMap";

//  将按钮权限转换为map形式，将来会挂载到路由meta上
export function convertButtonList(list) {
    const buttonPermissionMap = {};
    list.forEach(item => {
        const localButtonInfo = asyncButtonsMap[item.name];
        if (!localButtonInfo) {
            console.log(`前端没有配置这个按钮 ${item.name}`);
            // throw new Error(`前端没有配置这个按钮 ${item.name}`);
        }
        buttonPermissionMap[item.name] = item;
    });
    return buttonPermissionMap;
}

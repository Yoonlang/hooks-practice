
const React = (function() {
    let hooks = [];
    let idx = 0;

    function useState(initialVal) {
        const state = hooks[idx] || initialVal;
        const _idx = idx;
        const setState = (newVal) => {
            // 뒤에서 setState를 할 때, idx가 고정되어있지 않으면 hooks의 다른 원소를 가져올 수 있다.
            // 따라서 useState에 _idx 자체 변수를 두어 처리.
            hooks[_idx] = newVal;
        };

        idx++;
        return [state, setState];
    }

    function useEffect(cb, depArray) {
        // useEffect는 dep array를 받고 dep array 중 하나라도 바뀐 것이 있다면 hasChanged가 true가 되고 콜백함수를 호출한다.
        const oldDeps = hooks[idx];
        // 정상적으로 useState 후 useEffect라면 oldDeps는 항상 비어있는데?
        // 왜냐하면 useEffect는 depArray에 머가 들어있든 무조건 한번은 실행되기 때문이지.
        let hasChanged = true;

        if(oldDeps) {
            hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
            // 여기 들어있는 dep과 oldDeps[i]의 차이점?
            // oldDeps는 useState를 하고 최신화가 안된, 즉 useEffect로 인해 최신화가 된 값.
            // depArray의 dep은 useState로 최신화가 된 값.
            // 이게 다르다면 콜백 함수를 실행해야함
        }

        if(hasChanged){
            cb();
        }

        hooks[idx] = depArray;
        // 이번에 useState에서 바뀐 값들로 최신화를 해준 모습
        idx++;
    }

    function render(Component) {
        idx = 0;
        const C = Component();
        C.render();
        return C;
    }

    return { useState, useEffect, render };
})();


function Component() {
    const [count, setCount] = React.useState(1);
    const [text, setText] = React.useState("apple");

    React.useEffect(() => {
        console.log("---실행---");
    }, [count])

    return {
        render: () => console.log({count, text}),
        click: () => setCount(count + 1),
        type: (word) => setText(word),
    }
}

var App = React.render(Component);
App.click();
var App = React.render(Component);
App.click();
var App = React.render(Component);
App.type("orange");
var App = React.render(Component);
App.type("peach");
var App = React.render(Component);

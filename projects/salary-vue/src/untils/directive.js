//自定义全局指令directive by 墨含
export default {
    noMoreClick: { //指令用法v-no-more-click
        inserted(el) {
            el.addEventListener('click', () => {
                el.classList.add('is-disabled')
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                    el.classList.remove('is-disabled')
                }, 2000)
            })
        }
    }
}
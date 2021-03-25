// adapated from Jörg Bayreuther, https://codepen.io/mediadivisiongmbh, code at https://codepen.io/mediadivisiongmbh/pen/ERxywZ
// Vue and jQuery required

const allowedTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  /*'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td',*/ 'pre' ];
  // No tables!

const deleteEmptyTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'div',
  'table', 'thead', 'caption', 'tbody', 'pre' ];

const blockSelectTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li' ];

new Vue({
  el: '#app',
  data () {
    return {
      input: '',
      selectedTag: 'h2',
      tags: blockSelectTags
    }
  },
  methods: {
    handlePaste (e) {
      if (e.clipboardData && e.clipboardData.getData) {
        let inputHtml = e.clipboardData.getData('text/html');
        // If clipboard has html input, 
        // clean it and insert it manually
        if (inputHtml) {
          e.preventDefault();
          e.stopPropagation();
          const bodyRegex = /<body>([\s\S]*)<\/body>/g;
          const matches = bodyRegex.exec(inputHtml);
          const bodyHtml = matches ? matches[1] : inputHtml;
          const textarea = e.target;
          // Get current selection and compute the new value
          const startPos = textarea.selectionStart;
          const endPos = textarea.selectionEnd;
          this.input = textarea.value.substring(0, startPos)
            + this.sanitize(bodyHtml)
            + textarea.value.substring(endPos, textarea.value.length);
        }
      }
    },
    handleClick (e) {
      let el = e.target;
      let newChild = document.createElement(this.selectedTag);
      var node = document.createTextNode(el.textContent);
      newChild.appendChild(node);
      el.parentElement.replaceChild(newChild, el);
      let newHtml = this.$refs.preview.innerHTML;
      this.input = this.sanitize(newHtml);
    },
    sanitize (html) {
      let sanitized = sanitizeHtml(html, {
        allowedTags: allowedTags
      });
      sanitized = sanitized
        // <br /><br /> -> </p><p>
        .replace(/<br \/>(\s)*(<br \/>)+/g, '</p><p>')
        // </p><br /> -> </p>
        .replace(/<p \/>(\s)*(<br \/>)+/g, '</p>')
        // <p><br /> -> </p>
        .replace(/<p>(\s)*(<br \/>)+/g, '<p>')
        // use html5 <br> instead of xhtml <br />
        .replace(/<br\s*\/?>/ig, '<br>')
        // <br /><br /> -> </p><p>
        .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>');
      ;
      // delete empty tags
      deleteEmptyTags.forEach(tag => {
        let regex = new RegExp(`<${tag}>(\\s)*</${tag}>`, 'g');
        sanitized = sanitized
          .replace(regex, '');
      })
      
      return sanitized;
    }
  }
});


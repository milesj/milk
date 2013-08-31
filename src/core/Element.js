
(function() {

    /*------------------------------------ Element ------------------------------------*/

    var Element = new Type('Element', function(tag, props) {
        var construct = Element.Constructors[tag];

        if (construct) {
            return construct(props);
        }

        if (typeof tag !== 'string') {
            return document.id(tag).set(props);
        }

        props = props || {};

        /*if (!(/^[\w-]+$/).test(tag)){
        var parsed = Slick.parse(tag).expressions[0][0];
        tag = (parsed.tag == '*') ? 'div' : parsed.tag;
        if (parsed.id && props.id == null) props.id = parsed.id;

        var attributes = parsed.attributes;
        if (attributes) for (var attr, i = 0, l = attributes.length; i < l; i++){
        attr = attributes[i];
        if (props[attr.key] != null) continue;

        if (attr.value != null && attr.operator == '=') props[attr.key] = attr.value;
        else if (!attr.value && !attr.operator) props[attr.key] = true;
        }

        if (parsed.classList && props['class'] == null) props['class'] = parsed.classList.join(' ');
        }*/

        return document.newElement(tag, props);
    });

    // Elements should act like objects
    Element.parent = Object;

    // Holds pre-built functions to deliver fast element creation
    Element.Constructors = {};

}).call(this);
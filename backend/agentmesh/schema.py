def validate_arguments(schema, arguments):
    issues=[]
    if not isinstance(arguments, dict):
        return [type('Issue', (), {'path':'$', 'message':'arguments must be an object'})()]
    required=schema.get('required', []) if isinstance(schema, dict) else []
    properties=schema.get('properties', {}) if isinstance(schema, dict) else {}
    for key in required:
        if key not in arguments:
            issues.append(type('Issue', (), {'path':'$.'+key, 'message':'is required'})())
    for key, spec in properties.items():
        if key not in arguments: continue
        value=arguments[key]
        kind=spec.get('type') if isinstance(spec, dict) else None
        bad=(kind=='string' and not isinstance(value,str)) or (kind=='number' and (isinstance(value,bool) or not isinstance(value,(int,float)))) or (kind=='integer' and (isinstance(value,bool) or not isinstance(value,int))) or (kind=='boolean' and not isinstance(value,bool)) or (kind=='array' and not isinstance(value,list)) or (kind=='object' and not isinstance(value,dict))
        if bad: issues.append(type('Issue', (), {'path':'$.'+key, 'message':'invalid type'})())
    return issues

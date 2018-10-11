const simpleVShader =
`
  attribute vec3 vertex;
  attribute vec4 color;

  varying highp vec4 tColor;
  
  void main() 
  {
    tColor = color;
    //gl_Position = vec4(1.0, 1.0, 1.0, 1.0);
    gl_Position = vec4(vertex, 1.0);
  }
`;


const simpleFShader = 		
`
  varying highp vec4 tColor;
  
  void main() 
  {
    gl_FragColor = tColor;
  }
`;
        

const texture2DVShader =
`
  attribute vec3 vertex;
  attribute vec2 texCoor;
  attribute vec3 vertexNormal;
  
  
  uniform mat4 projectMatrix;
  uniform mat4 worldMatrix;
  uniform mat4 viewMatrix;
  
  uniform vec3 lightDir;

  varying highp vec2 coor;
  
  varying highp vec3 light;
  
  void main() 
  {
    highp vec3 surrLightSurrColor = vec3(0.2, 0.2, 0.2);
    highp vec3 dirLightColor = vec3(0.8, 0.8, 0.8);
    
    highp vec3 reLightDir = vec3(-lightDir.x, -lightDir.y, -lightDir.z);
    reLightDir = normalize(reLightDir);
    
    highp vec3 tVertexNormal = (viewMatrix * vec4(vertexNormal, 1.0)).xyz;
    tVertexNormal = normalize(tVertexNormal);
    
    highp float strong = dot(tVertexNormal, reLightDir);
    if (strong < float(0.0))
      strong = float(0.0);
    
    light = surrLightSurrColor + dirLightColor * strong;
    
    
    coor = texCoor;
    
    vec4 v = vec4(vertex, 1.0);
    gl_Position = projectMatrix * worldMatrix * viewMatrix * v;
  }
`;


const texture2DFShader =
`
  uniform sampler2D sampler;

  varying highp vec2 coor;
  varying highp vec3 light;
  
  void main() 
  {
    highp vec4 color  = vec4(texture2D(sampler, coor));
    gl_FragColor = vec4(light * color.rgb, color.a);
  }
`;




const bkgVShader =
`
  attribute vec3 vertex;
  
  uniform vec4 color;
  
  uniform mat4 viewMatrix;

  varying highp vec4 tColor;
  
  void main() 
  {
    tColor = color;
    
    vec4 v = vec4(vertex, 1.0);
    gl_Position = viewMatrix * v;
  }
`;


const bkgFShader =
`
  varying highp vec4 tColor;
  
  void main() 
  {
    gl_FragColor = tColor;
    
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;
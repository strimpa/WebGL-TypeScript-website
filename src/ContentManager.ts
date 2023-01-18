import * as THREE from "three";

/**
 * Describing one content
 */
export class ContentNode
{
  public title : string;
  public category : string;
  public keywords : Array<string>;
  public url : string;
}

/**
 * Loading and updating content from description files
 */
export class ContentManager
{
    // Content list
    private _content : Array<ContentNode>;

    /**
     * Standard
     */
    constructor()
    {
      this._content = new Array<ContentNode>();
    }

    get Content() 
    {
      return this._content;
    }
    
    /**
     * Initiate resource loading
     * @returns whether successful
     */
    load() : Boolean
    {
//        try {
            // 👇️ const response: Response
            const response = fetch('/content.xml', 
            {
              method: 'GET',
              headers: 
              {
                Accept: 'application/xml',
              },
            }).then(response => 
            {
              if (!response.ok) 
              {
                throw new Error(`Error! status: ${response.status}`);
              }
              else
              {
                response.text().then(txt => this.init(txt));
              }
            });
/*        } catch (error) {
            if (error instanceof Error) {
              console.log('error message: ', error.message);
              return false;
            } else {
              console.log('unexpected error: ', error);
              return false;
            }
          }
*/        
        return true;
    }

    /**
     * 
     */
    init(contentString : string) : Boolean
    {
      let parser : DOMParser = new DOMParser();
      let result : Document = parser.parseFromString(contentString, "application/xml");
      let root = result.children[0];
      for (let childIndex = 0; childIndex < root.children.length; childIndex++)
      {
        this._content.push({
            title:root.children[childIndex].children[0].textContent,
            category:root.children[childIndex].children[2].textContent,
            keywords:root.children[childIndex].children[3].textContent.split(","),
            url:root.children[childIndex].children[5].textContent
          });
      }
      return true;
    }
}

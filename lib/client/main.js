import React from 'react'
import ReactDom from 'react-dom'
import t from 'tcomb-form'
import {mergeFieldActions, structureToActions} from "../shared/tools"
import {enumeratedRefinements, fetchRefinement} from "./load-refinements"
import {enumeratedStructures, fetchStructure, addStructure} from "./services/structures"
import plan from "../shared/action-converter"
var types = {
  "t.String": "String",
  "t.Number": "Number",
  "t.Boolean": "Boolean",
  "t.Date": "Date",
  "t.refinement": "RefinedType",
  "t.enums": "Restricted List",
  "t.list": "Appendable List",
  "t.struct": "SubStructure",
}

const Enumerable = t.struct({
  value:t.String,
  display:t.String
});

var EditorSchema = t.struct({
  label:t.Str,
  type: t.enums(types),
  optional: t.Boolean,
  subtype: t.maybe(t.enums(enumeratedStructures, "structures")),
  restrictedItems: t.maybe(t.list(Enumerable)),
  refinementType: t.maybe(t.enums(enumeratedRefinements, "refinements"))
})

function rebuildEditor(){
  EditorSchema = t.struct({
    label:t.Str,
    type: t.enums(types),
    optional: t.Boolean,
    subtype: t.maybe(t.enums(enumeratedStructures, "structures")),
    restrictedItems: t.maybe(t.list(Enumerable)),
    refinementType: t.maybe(t.enums(enumeratedRefinements, "refinements"))
  })
  TopSchema = t.struct({
    constructName: t.String,
    editor: EditorSchema
  })
}

var TopSchema = t.struct({
  constructName: t.String,
  editor: EditorSchema
})

const FormSchema = t.struct({
  name: t.String,         // a required string
  age: t.maybe(t.Number), // an optional number
  rememberMe: t.Boolean   // a boolean
})

const App = React.createClass({

  getInitialState: function() {
    return {fields:[], formData:{constructName: ""}, formSchema:t.struct({})};
  },

  addField(evt){
    evt.preventDefault();
    const value = this.refs.form.getValue();
    if(value){
      var actionObject = {action:"add", value:value};
      var formSchema = mergeFieldActions(this.state.fields.concat([actionObject]), fetchStructure, fetchRefinement)
      structureToActions(formSchema.schema);
      console.log(actionObject);
      this.setState({
        fields: this.state.fields.concat([actionObject]),
        formData:{
          constructName:value.constructName
        },
        formSchema: formSchema.schema
      });
    }
  },

  onSubmit(evt) {
    evt.preventDefault()
    if(this.state.formData.constructName !== ''){
      var formSchema = mergeFieldActions(this.state.fields, fetchStructure, fetchRefinement)
      addStructure(formSchema.constructName, formSchema.schema);
      rebuildEditor();
      this.setState({fields:[], formData:{constructName: ""}, formSchema:t.struct({})});
    }
  },

  render() {
    return (
      <div>
      <form onSubmit={this.onSubmit}>
        <t.form.Form ref="form" type={TopSchema} value={this.state.formData} />
        <div className="form-group">
          <button className="btn" onClick={(e) => {this.addField(e)}}>Add Field</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
      <div onSubmit={this.onSubmit}>
        <t.form.Form ref="div" type={this.state.formSchema} />
      </div>
      </div>
    )
  }

})

ReactDom.render(<App/>, document.getElementById("app"));

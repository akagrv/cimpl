import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { AlertService } from "../_alert";
import axios from "axios";
import { dropdownConfig } from "./constants";

@Component({
  selector: "app-collibra",
  templateUrl: "./collibra.component.html",
  styleUrls: ["./collibra.component.css"],
})
export class CollibraComponent implements OnInit {
  public collibraForm: FormGroup;
  private submitted: boolean = false;
  private assetTypes = ["Schema", "Table", "Column"];
  private dropdownConfig: object = dropdownConfig;
  private communityDropdownOptions: any;
  private domainDropdownOptions: any;
  private assetDropdownOptions: any;
  private IMPORT_URL: string =
    "https://sbrny4l1xh.execute-api.us-west-2.amazonaws.com/collibra-test-stage-1/";
  private DOMAIN_URL: string =
    "https://sbrny4l1xh.execute-api.us-west-2.amazonaws.com/collibra-test-stage-1/domains";
  // private COMMUNITY_URL: string =
  //   "https://cors-anywhere.herokuapp.com/https://asu-dev.collibra.com/rest/2.0/communities";
  private COMMUNITY_URL: string =
    "https://sbrny4l1xh.execute-api.us-west-2.amazonaws.com/collibra-test-stage-1/communities";
  private ASSET_URL: string =
    "https://sbrny4l1xh.execute-api.us-west-2.amazonaws.com/collibra-test-stage-1/assets";

  private selectedDomainId: any = "";
  private assetTypeId = {
    Schema: "00000000-0000-0000-0001-000400000002",
    Table: "00000000-0000-0000-0000-000000031007",
    Column: "00000000-0000-0000-0000-000000031008",
  };

  private attributes: Array<String> = [
    "Description",
    "Note",
    "Dataset Name",
    "Data Area",
    "Use Cases",
    "Granularity",
    "Accuracy",
    "Technical Details",
    "Technical Contact",
    "Refresh Schedule",
    "SME",
    "Data Source",
  ];

  private isChecked: any = {
    Description: false,
    Note: false,
    "Dataset Name": false,
    "Data Area": false,
    "Use Cases": false,
    Granularity: false,
    Accuracy: false,
    "Technical Details": false,
    "Technical Contact": false,
    "Refresh Schedule": false,
    SME: false,
    "Data Source": false,
  };

  constructor(
    private fb: FormBuilder,
    private alerts: AlertService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    axios
      .get(this.COMMUNITY_URL, {
        headers: {
          "x-api-key": "vX7kDWra4Y8YcfXcMNavs5vXos4agjRL839hLP8u",
        },
      })
      .then((res) => {
        this.communityDropdownOptions = res.data.results;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  initForm() {
    this.collibraForm = this.fb.group({
      //name: ["", Validators.required],
      // asuriteId: ["", Validators.required],
      communityName: ["", Validators.required],
      domainName: ["", Validators.required],
      assetType: ["", Validators.required],
      assetName: ["", Validators.required],
      checkArray: this.fb.array([], [Validators.required]),
      Note: ["", Validators.required],
      Description: ["", Validators.required],
      "Dataset Name": ["", Validators.required],
      "Data Area": ["", Validators.required],
      "Use Cases": ["", Validators.required],
      Granularity: ["", Validators.required],
      Accuracy: ["", Validators.required],
      "Technical Details": ["", Validators.required],
      "Technical Contact": ["", Validators.required],
      "Refresh Schedule": ["", Validators.required],
      SME: ["", Validators.required],
      "Data Source": ["", Validators.required],
    });

    this.attributes.forEach((attribute: string) => {
      this.collibraForm.get(attribute).disable();
    });
  }

  get form() {
    return this.collibraForm.controls;
  }

  onCheckboxChange(e) {
    let value = e.target.value;
    const checkArray: FormArray = this.collibraForm.get(
      "checkArray"
    ) as FormArray;

    if (e.target.checked) {
      // debugger;
      checkArray.push(new FormControl(value));
      this.collibraForm.get(value).enable();
      this.isChecked[value] = true;
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == value) {
          checkArray.removeAt(i);
          this.collibraForm.get(value).disable();
          this.isChecked[value] = false;
          this.cd.detectChanges();
          return;
        }
        i++;
      });
    }
    this.cd.detectChanges();
  }

  getDomainList(selected: any) {
    axios
      .get(this.DOMAIN_URL, {
        params: {
          communityId: selected.value.id,
        },
        headers: {
          "x-api-key": "vX7kDWra4Y8YcfXcMNavs5vXos4agjRL839hLP8u",
        },
      })
      .then((res) => {
        this.domainDropdownOptions = res.data.results;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAssetList(selected: any) {
    axios
      .get(this.ASSET_URL, {
        params: {
          communityId: this.selectedDomainId.community.id,
          domainId: this.selectedDomainId.id,
          typeId: this.assetTypeId[selected.target.value],
          limit: "50000", // TODO: handle larger requests
        },
        headers: {
          "x-api-key": "vX7kDWra4Y8YcfXcMNavs5vXos4agjRL839hLP8u",
        },
      })
      .then((res) => {
        this.assetDropdownOptions = res.data.results;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit(value: any) {
    this.submitted = true;
    if (this.collibraForm.invalid) return;

    /* const fileName: string =
      value.name + "_" + Math.floor(Math.random() * Math.floor(1000)) + ".txt";
    console.log(fileName);
    Storage.put(fileName, value)
      .then((result) => {
        this.alerts.success("Request Submitted!", { autoClose: true });
        console.log(result);
        this.collibraForm.reset();
      })
      .catch((err) => {
        this.alerts.error(JSON.stringify(err), { autoClose: true });
        console.log(err);
      }); */

    /* let file: File;
    let attributes_obj = {};
    this.attributes.forEach((attribute: string) => {
      if (this.isChecked[attribute]) {
        attributes_obj[attribute] = [
          {
            value: value[attribute],
          },
        ];
      }
    });
    file = this.getJSONTemplate(
      value.communityName.name,
      value.domainName.name,
      value.assetType,
      value.assetName.name,
      attributes_obj
    ); 
    
    const formData = new FormData();
    formData.append("file", file);
    */

    let attributes_obj = {};
    this.attributes.forEach((attribute: string) => {
      if (this.isChecked[attribute]) {
        attributes_obj[attribute] = value[attribute];
      }
    });

    const body = {
      communityName: value.communityName.name,
      domainName: value.domainName.name,
      domainType: "Physical Data Dictionary",
      assets: [
        {
          assetName: value.assetName.name,
          assetType: value.assetType,
          assetAttributes: attributes_obj,
        },
      ],
    };

    axios
      .post(this.IMPORT_URL, body, {
        headers: {
          "x-api-key": "vX7kDWra4Y8YcfXcMNavs5vXos4agjRL839hLP8u",
        },
      })
      .then((res) => {
        console.log(res);
        this.alerts.success("Success!", { autoClose: true });
        this.collibraForm.reset();
        this.submitted = false;
      })
      .catch((err) => {
        this.alerts.error(JSON.stringify(err), { autoClose: true });
        console.log(err);
      });
  }

  /* getJSONTemplate(
    communityName: string,
    domainName: string,
    assetType: string,
    assetName: string,
    attributes_obj: any
  ): File {
    let jsonObj: object = {
      resourceType: "Asset",
      identifier: {
        name: assetName,
        domain: {
          name: domainName,
          community: {
            name: communityName,
          },
        },
      },
      attributes: attributes_obj,
      type: {
        name: assetType,
      },
    };

    console.log(JSON.stringify(jsonObj));
    let file = new File([JSON.stringify(jsonObj)], "collibra_template.json");

    return file;
  } */
}

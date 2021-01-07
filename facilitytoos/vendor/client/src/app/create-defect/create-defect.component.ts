import { CategoryService } from './../services/category.service';
import { Router } from '@angular/router';
import { ReportService } from './../services/report.service';
import { map, expand } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Campus, Report, Status, Priority, Category } from '../models/Report';
import { ToastrService } from 'ngx-toastr';
import { CompressorService } from '../services/Compressor.service';
import { EMPTY } from 'rxjs';
import {ELLfloor,NOOfloor,ELLLocationfloorMin_1,ELLLocationfloor_0,
ELLLocationfloor_1,ELLLocationfloor_2,ELLLocationfloor_3,ELLLocationfloor_4,
NOOLocationfloorMin_1,NOOLocationfloor_0,NOOLocationfloor_1,
NOOLocationfloor_2,NOOLocationfloor_3,NOOLocationfloor_4,NOOLocationfloor_5
}
from '../models/groundplans'
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-defect',
  templateUrl: './create-defect.component.html',
  styleUrls: ['./create-defect.component.css']
})
export class CreateDefectComponent implements OnInit {
  departments = [
    'Facilitaire diensten',
    'ICT diensten',
    'Herstellingen Didactisch materiaal'
  ]


  selectedFile: File;
  fileName: string;
  campusen = Campus;
  selectedCampus: string;
  selectedCategorie: string;
  public campusenOption = [];
  public report: Report = new Report();
  Categories: String[] = [];
  public floors:string[];
  public locaties:string[];


 public  userid = localStorage.getItem("UserID");
 public userName = localStorage.getItem("UserName");


  constructor(private serviceReport: ReportService, private toastr: ToastrService, private router:Router,private compressor: CompressorService , private categoryService : CategoryService) { }
  data: FileList;
  compressedImages = [];
  recursiveCompress = (image: File, index, array) => {
    return this.compressor.compress(image).pipe (
      map(response => {

      //Code block after completing each compression
        console.log('compressed ' + index + image.name);
        this.compressedImages.push(response);
        return {
          data: response,
          index: index + 1,
          array: array,
        };
      }),
    );
  }
  ngOnInit() {
    this.campusenOption = Object.keys(this.campusen);
   // this.getAllCategorie();


  }



  public process (event) {
    this.data = event.target.files;
    this.fileName = event.target.files[0].name
    console.log('input: '  + this.data[0]);
    const compress = this.recursiveCompress( this.data[0], 0, this.data ).pipe(
      expand(res => {
        return res.index > res.array.length - 1
          ? EMPTY
          : this.recursiveCompress( this.data[res.index], res.index, this.data );
      }),
    );
    compress.subscribe(res => {
      if (res.index > res.array.length - 1) {


      //Code block after completing all compression
        console.log('Compression successful ' + this.compressedImages);
      }
    });
  }


  /**
   * deze function call backend function om een  reports aan te maken
   *
   */
  createReport() {
    this.serviceReport.createReport(this.report, this.compressedImages,this.userName,this.userid).subscribe(res => {
      console.log("addedd success");
      this.toastr.success("Bedankt !", "Defect wordt toegevoegd");
      this.router.navigate(['/meldingen/defectMelden']);
    }, error => {
      this.toastr.error("Er is een Error")
    })
  };

/**
 * deze function call backend function om Alle  Categorie vanuit database te halen
 *
 */
  onDepartmentChange(e){
    console.log(e.target.value);
    const department = e.target.value;
    this.categoryService.getCategoriesBydepartment(department).subscribe(res => {
      //console.log(res[0].categories);
      this.Categories = res[0].categories;
    }, error => {
      console.log(error);
    })
  }
onCampusChange(event){
  if(event.target.value === "ELL"){
    this.floors = ELLfloor;
    this.selectedCampus = "ELL"

  } else{
    this.floors = NOOfloor;
      this.selectedCampus = "NOO"
  }
  console.log(this.floors);
}


onEtageChange(event) {
  if(this.selectedCampus === "ELL"){
    if(event.target.value === '-1') {
      this.locaties = ELLLocationfloorMin_1
    } else if(event.target.value === '0'){
      this.locaties = ELLLocationfloor_0

    } else if(event.target.value === '1'){
      this.locaties = ELLLocationfloor_1

    } else if(event.target.value === '2'){

      this.locaties = ELLLocationfloor_2
    } else if(event.target.value === '3'){
      this.locaties = ELLLocationfloor_3

    } else if(event.target.value === '4'){
      this.locaties = ELLLocationfloor_4

    }
  } else {
        if(event.target.value === '-1') {
      this.locaties = NOOLocationfloorMin_1
    } else if(event.target.value === '0'){
      this.locaties = NOOLocationfloor_0

    } else if(event.target.value === '1'){
      this.locaties = NOOLocationfloor_1

    } else if(event.target.value === '2'){

      this.locaties = NOOLocationfloor_2
    } else if(event.target.value === '3'){
      this.locaties = NOOLocationfloor_3

    } else if(event.target.value === '4'){
      this.locaties = NOOLocationfloor_4

    }else if(event.target.value === '5'){
      this.locaties = NOOLocationfloor_5

    }
  }
}
}

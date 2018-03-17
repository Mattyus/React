import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.min.css';
import './css/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Table, Pagination, Button, Modal, FormGroup, Glyphicon, ControlLabel, FormControl } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Moment from 'react-moment';
import flickr from './img/flickr.jpg';
import vimeo from './img/vimeo.png';

/** BookmarkCollection */
class BookmarkCollection extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			id_sequence: 3,// next id
			data:[// tableau des bookmark
				{
					id:1,
					url:'https://www.flickr.com/photos/75506839@N06/6940508877/in/photolist-bziVua-gyVf8L-4k5CZk-5iynax-gKydF2-uPg1t-9fSwAe-rPL67U-Co9A1Y-6C8UGH-eJEqt-sMMDA-2fvHr-22w7Hk-DZn86-5de5bB-9LJ5Rh-kp6ByD-8hr5oQ-8BeiQA-Bkvu8-5dTJuk-3TW6mx-8SK6ma-8cx1yH-mWuUV-66qyvc-7L94pZ-dRpZv7-6eT2HN-8wR9rb-4J8fQb-c2hEUN-5d8jmt-dPwY5t-4agFj4-5y1kHM-5JBPJY-5nBeH9-8spoWQ-dJFFbN-5s6zvd-pg6b9K-E18PX-5GrwNN-bDVap8-4HBaS1-7UXYSQ-gbNoMr-Mnufa',
					title:'Ange',
					author_name:'AbelleAnanta',
					added_date:moment(),
					width:'350',
					height:'323',
					duration:'',
					tags:[]
				},
				{
					id:2,
					url:'https://vimeo.com/52270684',
					title:'Manga',
					author_name:'mozuya',
					added_date:moment(),
					width:'350',
					height:'323',
					duration:'00:34',
					tags:[]
				},
			],
		};
		
		this.addBookmark = this.addBookmark.bind(this);
		this.delBookmark = this.delBookmark.bind(this);
		this.modifBookmark = this.modifBookmark.bind(this);
		
	}
	
	// Ajout d'un bookmark
	addBookmark(bookmark){
		bookmark.id = this.state.id_sequence;
		let data = this.state.data.concat(bookmark);
		this.setState({data: data});
		this.setState({id_sequence: this.state.id_sequence + 1});
	}
	
	// Suppression d'un bookmark
	delBookmark(id){
		let data = this.state.data.filter((e) => e.id !== id);
		this.setState({data: data});
	}
	
	// Modification d'un bookmark
	modifBookmark(bookmark){
		let data = this.state.data;
		let item = data.find(x => x.id === bookmark.id);
		let index = data.indexOf(item);
		data[index] = bookmark;
		this.setState({data: data});
	}
		
	render() {
		return (
			<div className="bookmarkCollection container">
				<h1>Bookmarks</h1>
				<div className="btn-group">
					<Button bsStyle="primary" onClick={() => this.refs.bookmarkForm.toggle()}>Ajouter un lien</Button>
				</div>
				<BookmarkForm ref="bookmarkForm" title="Ajouter un lien" onBookmarkSubmit={this.addBookmark} bookmark={[]}/>
				<ListPagination data={this.state.data} del={this.delBookmark} modif={this.modifBookmark}/>				
			</div>
		);
	}
};

/** Bookmark */
class Bookmark extends React.Component{
	render() {																						   
		let image = null;
		if (this.props.bookmark.url.startsWith('https://www.flickr.com')) {
			image = <img alt="flickr" src={flickr}/>;
		} else if (this.props.bookmark.url.startsWith('https://vimeo.com')){
			image = <img alt="vimeo" src={vimeo}/>;
		}
	  
		return (
			<tr className="bookmark">
				<td>{image}</td>
            	<td>{this.props.bookmark.url}</td>
            	<td>{this.props.bookmark.title}</td>
            	<td>{this.props.bookmark.author_name}</td>
            	<td><Moment format="DD/MM/YYYY">{this.props.bookmark.added_date}</Moment></td>
				<td className="col-button"><Button bsStyle="primary" onClick={() => this.props.modif(this.props.bookmark)}><Glyphicon glyph="pencil"/></Button></td>
				<td className="col-button"><Button bsStyle="danger" onClick={() => this.props.del(this.props.bookmark.id)}><Glyphicon glyph="remove-circle"/></Button></td>
				
          	</tr>
		);
  	}
};

/** ListPagination */
class ListPagination extends React.Component{
	constructor() {
		super();
		this.state = {
			currentPage: 1,
			linkPerPage: 10,
			options: [1,5,10]
		};
		this.handleClick = this.handleClick.bind(this);
		this.handlePrevious = this.handlePrevious.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}
	
	handlePrevious() {
		if (this.state.currentPage > 1){
			this.setState({
				currentPage: this.state.currentPage - 1
			});
		}
	}
	
	handleNext() {
		if (this.state.currentPage < Math.ceil(this.props.data.length / this.state.linkPerPage)){
			this.setState({
				currentPage: this.state.currentPage + 1
			});			
		}
	}
	
	handleClick(event) {
		this.setState({
			currentPage: Number(event.target.id)
		});
	}
	
	updateValue (event) {
		this.setState({
			linkPerPage: event.target.value,
			currentPage: 1
		});
	}
	
	render() {
		var indexOfLastLink = this.state.currentPage * this.state.linkPerPage;
		const indexOfFirstLink = indexOfLastLink - this.state.linkPerPage;
		const currentListLink = this.props.data.slice(indexOfFirstLink, indexOfLastLink);
		
		// Logic for displaying page numbers
		const pageNumbers = [];
		for (let i = 1; i <= Math.ceil(this.props.data.length / this.state.linkPerPage); i++) {
			pageNumbers.push(i);
		}
		
		const renderPageNumbers = pageNumbers.map(number => {
			return (
				<Pagination.Item key={number} id={number} onClick={this.handleClick} active={number === this.state.currentPage}>{number}</Pagination.Item>
			);
		});
		
		const options = this.state.options.map( option => {
			return (
				<option key={option} value={option}>
          			{option}
				</option>
			);
		});
		
		return (
			<div className="listPagination">
				<BookmarkList data={currentListLink} del={this.props.del} modif={this.props.modif}/>
				<div className="row">
					<Pagination>
  						<Pagination.Prev onClick={this.handlePrevious}/>
						{renderPageNumbers}
						<Pagination.Next onClick={this.handleNext}/>
					</Pagination>
					<FormGroup className="col-md-1">
      					<FormControl componentClass="select" placeholder="select" value={this.state.linkPerPage} onChange={this.updateValue}>{options}</FormControl>
    				</FormGroup>
				</div>
			</div>
		);
	}
	
}

/** BookmarkList */
class BookmarkList extends React.Component{	
	constructor(props) {
		super(props)
		this.state = {
			selectedBookmark: {}
		}
		this.selectBookmark = this.selectBookmark.bind(this);
	}
	
	selectBookmark (bookmark){
		this.setState({selectedBookmark: bookmark}, () => this.refs.bookmarkForm.toggle());
	}
	
	render() {
		var bookmarkNodes = this.props.data.map(bookmark => {
			return (
				<Bookmark key={bookmark.id} bookmark={bookmark} del={this.props.del} modif={this.selectBookmark}/>
			);
		});
		
		return (
			<div className="bookmarkList">
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>#</th>
							<th>URL</th>
							<th>TITLE</th>
							<th>AUTHOR NAME</th>
							<th>ADDED DATE</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{bookmarkNodes}
					</tbody>
				</Table>
				<BookmarkForm ref="bookmarkForm" title="Modification du lien" onBookmarkSubmit={this.props.modif} bookmark={this.state.selectedBookmark}/>
			</div>
		);
	}
};

/** BookmarkForm */
class BookmarkForm extends React.Component{
	constructor(props) {
		moment.locale("fr");
		super(props)
		this.state = {
			modal:false,
			isVideo:false,
			bookmark: {
				id:0,
				url:'',
				title:'',
				author_name:'',
				added_date:null,
				width:'',
				height:'',
				duration:'',
				tags:[]
			},
			urlHasError: false,
			titleHasError: false,
			authorHasError: false,
			dateHasError: false,
			widthHasError: false,
			heightHasError: false,
			durationHasError: false
		}
		this.toggle = this.toggle.bind(this);
		this.handleUrlChange = this.handleUrlChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleAuthorNameChange = this.handleAuthorNameChange.bind(this);
		this.handleAddedDateChange = this.handleAddedDateChange.bind(this);
		this.handleWidthChange = this.handleWidthChange.bind(this);
		this.handleHeightChange = this.handleHeightChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDurationChange = this.handleDurationChange.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.validationForm = this.validationForm.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		
	}
	
	getInitialState() {		
        this.isVideo();
    }
	
	componentWillReceiveProps(props) {
		this.setState({bookmark : props.bookmark});
	}
	
	isVideo(){		
		if (this.state.bookmark.url.startsWith('https://vimeo.com')){
			this.setState({isVideo: true});
		} else {
			this.setState({isVideo: false});
		}
	}
	
	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}
	
	handleUrlChange(e) {
		let bookmark = {...this.state.bookmark};
		bookmark.url = e.target.value;
		this.setState({bookmark} , () => this.isVideo());
	}
	
	handleTitleChange(e) {
		let bookmark = {...this.state.bookmark};
		bookmark.title = e.target.value;
		this.setState({bookmark});
	}
	
	handleAuthorNameChange(e) {
		let bookmark = {...this.state.bookmark};
		bookmark.author_name = e.target.value;
		this.setState({bookmark});
	}
	
	handleAddedDateChange(date) {
		let bookmark = {...this.state.bookmark};
		bookmark.added_date = date;
		this.setState({bookmark});
	}
	
	handleWidthChange(e) {
		let bookmark = {...this.state.bookmark};
		bookmark.width = e.target.value;
		this.setState({bookmark});
	}
	
	handleHeightChange(e) {
		let bookmark = {...this.state.bookmark};
		bookmark.height = e.target.value;
		this.setState({bookmark});
	}
	
	handleDurationChange(e) {
		let bookmark = {...this.state.bookmark};
		bookmark.duration = e.target.value;
		this.setState({bookmark});
	}
	
	handleDelete(i) {
		let bookmark = {...this.state.bookmark};
		bookmark.tags.splice(i, 1);;
        this.setState({bookmark});
    }
 
    handleAddition(tag) {
		let bookmark = {...this.state.bookmark};
        bookmark.tags.push({
            id: bookmark.tags.length + 1,
            text: tag
        });
        this.setState({bookmark});
    }
 
    handleDrag(tag, currPos, newPos) {
        let bookmark = {...this.state.bookmark};
 
        // mutate array
        bookmark.tags.splice(currPos, 1);
        bookmark.tags.splice(newPos, 0, tag);
 
        // re-render
        this.setState({bookmark});
    }
	
	validationForm(){
		let formHasError = false;
		if (this.state.bookmark.url.trim()){// validation url	
			this.setState({urlHasError: false});
		} else {
			this.setState({urlHasError: true});
			formHasError = true;
		}
		
		if (this.state.bookmark.title.trim()){// validation title
			this.setState({titleHasError: false});
		} else {
			this.setState({titleHasError: true});
			formHasError = true;
		}
		
		if (this.state.bookmark.author_name.trim()){// validation author_name
			this.setState({authorHasError: false});
		} else {
			this.setState({authorHasError: true});
			formHasError = true;
		}
		
		if (this.state.bookmark.added_date){// validation added_date
			this.setState({dateHasError: false});
		} else {
			this.setState({dateHasError: true});
			formHasError = true;
		}

		if (this.state.bookmark.width.trim()){// validation width
			this.setState({widthHasError: false});
		} else {
			this.setState({widthHasError: true});
			formHasError = true;
		}
		
		if (this.state.bookmark.height.trim()){// validation height
			this.setState({heightHasError: false});
		} else {
			this.setState({heightHasError: true});
			formHasError = true;
		}

		if (this.isVideo()){
			if (this.state.bookmark.height.trim()){// validation duration
				this.setState({durationHasError: false});
			} else {
				this.setState({durationHasError: true});
				formHasError = true;
			}
		}

		return formHasError;
	}
	
	handleSubmit(e) {
		e.preventDefault();
		if (this.validationForm()) {
			return;
		}
		this.props.onBookmarkSubmit(this.state.bookmark);
		let bookmark = {...this.state.bookmark};
		bookmark.id = 0;
		bookmark.url = '';
		bookmark.title = '';
		bookmark.author_name = '';
		bookmark.added_date = '';
		bookmark.width = '';
		bookmark.height = '';
		bookmark.duration = '';
		bookmark.tags = [];
		this.setState({bookmark});
		this.toggle();
	}
	
	render() {
		return (
			<div>
				<Modal show={this.state.modal} onHide={this.toggle}>
					<form className="bookmarkForm" onSubmit={this.handleSubmit}>
						<Modal.Header closeButton>{this.props.title}</Modal.Header>
						<Modal.Body>
							<FormGroup className={this.state.urlHasError?'has-error':''}>
								<ControlLabel>Url</ControlLabel>
								<FormControl type="text" name="url" id ="url" onChange={this.handleUrlChange} value={this.state.bookmark.url || ''}/>
								{this.state.urlHasError?<p className="text-danger">Le champ Url est obligatoire</p> : ''}								
							</FormGroup>
							<FormGroup className={this.state.titleHasError?'has-error':''}>
								<ControlLabel>Title</ControlLabel>
								<FormControl type="text" name="title" id="title" onChange={this.handleTitleChange} value={this.state.bookmark.title || ''}/>
								{this.state.titleHasError?<p className="text-danger">Le champ Title est obligatoire</p> : ''}	
							</FormGroup>
							<FormGroup className={this.state.authorHasError?'has-error':''}>
								<ControlLabel>Author Name</ControlLabel>
								<FormControl type="text" name="author_name" id="author_name" onChange={this.handleAuthorNameChange} value={this.state.bookmark.author_name || ''}/>
								{this.state.authorHasError?<p className="text-danger">Le champ Author Name est obligatoire</p> : ''}
							</FormGroup>
							<FormGroup className={this.state.dateHasError?'has-error':''}>
								<ControlLabel>Added Date</ControlLabel>
								<DatePicker id="added_date" name="added_date" className="form-control"  selected={this.state.bookmark.added_date} onChange={this.handleAddedDateChange}  dateFormat="DD/MM/YYYY"/>
								{this.state.dateHasError?<p className="text-danger">Le champ Added Date est obligatoire</p> : ''}
							</FormGroup>
							<FormGroup className={this.state.widthHasError?'has-error':''}>
								<ControlLabel>Width</ControlLabel>
								<FormControl type="text" name="width" id="width" onChange={this.handleWidthChange} value={this.state.bookmark.width || ''}/>
								{this.state.widthHasError?<p className="text-danger">Le champ Width est obligatoire</p> : ''}
							</FormGroup>
							<FormGroup className={this.state.heightHasError?'has-error':''}>
								<ControlLabel>Height</ControlLabel>
								<FormControl type="text" name="height" id="height" onChange={this.handleHeightChange} value={this.state.bookmark.height || ''}/>
								{this.state.heightHasError?<p className="text-danger">Le champ Height est obligatoire</p> : ''}
							</FormGroup>
							{this.state.isVideo?
								<FormGroup className={this.state.durationHasError?'has-error':''}>
									<ControlLabel>Duration</ControlLabel>
									<FormControl type="text" name="duration" id="duration" onChange={this.handleDurationChange} value={this.state.bookmark.duration || ''}/>
									{this.state.durationHasError?<p className="text-danger">Le champ Duration est obligatoire</p> : ''}
								</FormGroup>
							:null}
							<FormGroup>
								<ControlLabel>Tags</ControlLabel>
								<ReactTags tags={this.state.bookmark.tags}
									handleDelete={this.handleDelete}
									handleAddition={this.handleAddition}
									handleDrag={this.handleDrag} />
							</FormGroup>
						</Modal.Body>
						<Modal.Footer>
							<Button color="secondary" onClick={this.toggle}>Annuler</Button>
							<Button type="submit" bsStyle="primary">Valider</Button>
						</Modal.Footer>
					</form>
				</Modal>
			</div>			
		);
	}
};

/** Initialisation */
ReactDOM.render(
	<BookmarkCollection/>,
	document.getElementById('root')
);
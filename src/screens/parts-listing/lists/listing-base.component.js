import { PureComponent } from 'react';
import { FlatList } from 'react-native';

export class ListingBase extends PureComponent {
    onEndReachedThreshold = 0.1;
    initialNumToRender = 3;
    limit = 5;
    backendApi: Function;
    scrollEventIsBlocking: boolean;
    list: FlatList;

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.textSearch !== this.props.textSearch) {
            try {
                this.scrollEventIsBlocking = true;
                this.setState({ page: 1 }, () => this.getData());
                this.list.scrollToOffset({ offset: 0, animated: false });
            } catch (e) {}
        }
    }

    async getData() {
        if (this.state.loading) {
            return false;
        }

        const { page } = this.state;
        this.setState({ loading: true });

        const hasNext = await this.backendApi(page, this.props.textSearch, this.limit);

        this.setState({
            loading: false,
            refreshing: false,
            hasNext
        });

        return true;
    }

    onMomentumScrollBegin() {
        this.scrollEventIsBlocking = false;
    }

    refreshData() {
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            this.getData();
        });
    }

    async onEndReached() {
        if (!this.scrollEventIsBlocking && !this.state.loading && this.state.hasNext) {
            this.scrollEventIsBlocking = true;
            this.setState({
                page: this.state.page + 1,
            }, () => {
                this.getData();
            });
        }
    }
}
